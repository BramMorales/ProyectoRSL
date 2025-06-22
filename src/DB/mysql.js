// src/DB/mysql.js
const { Pool } = require('pg');
const config = require('../config');

/**
 * Configuración de conexión a PostgreSQL
 */
const pool = new Pool({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
  // Opcional: ssl, etc.
});

/**
 * Mapeo de claves primarias según la tabla
 */
function getPrimaryKey(tabla) {
  switch (tabla) {
    case 'rsluser':
      return 'id_rsluser';
    case 'rslauth':
      return 'id_rslauth';
    default:
      return 'id';
  }
}

/**
 * Manejo de errores de conexión en el pool
 */
pool.on('error', (err) => {
  console.error('[db err]', err);
  // Aquí se podría agregar lógica para reconectar o alertar
});

(async () => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1'); // Consulta de prueba
    client.release();
    console.log('✅ Base de datos lista (PostgreSQL)');
  } catch (err) {
    console.error('❌ Error al conectar con la base de datos:', err.message);
  }
})();

/**
 * Helper para obtener todos los registros de una tabla
 * @param {string} tabla – nombre de la tabla (debe venir de lista blanca)
 * @returns {Promise<Array>} – arreglo con los registros
 */
async function todos(tabla) {
  const client = await pool.connect();
  try {
    // IMPORTANTE: validar que "tabla" provenga de una lista blanca
    const res = await client.query(`SELECT * FROM ${tabla}`);
    return res.rows;
  } catch (error) {
    return Promise.reject(error);
  } finally {
    client.release();
  }
}

/**
 * Helper para obtener un solo registro por su clave primaria
 * @param {string} tabla – nombre de la tabla
 * @param {number|string} id – valor de la clave primaria (ej. id_rsluser)
 * @returns {Promise<Object|null>} – objeto con el registro o null si no existe
 */
async function uno(tabla, id) {
  const client = await pool.connect();
  try {
    const pk = getPrimaryKey(tabla);
    const res = await client.query(
      `SELECT * FROM ${tabla} WHERE "${pk}" = $1 LIMIT 1`,
      [id]
    );
    return res.rows[0] || null;
  } catch (error) {
    return Promise.reject(error);
  } finally {
    client.release();
  }
}

function getPrimaryKey(tabla) {
  const claves = {
    rsluser: 'id_rsluser',
    rslauth: 'id_rslauth',
    rslespecialidad: 'id_rslespecialidad',
    // Agrega más tablas y sus claves aquí según las que tengas
  };

  if (!claves[tabla]) {
    throw new Error(`No se definió clave primaria para la tabla "${tabla}"`);
  }

  return claves[tabla];
}


/**
 * Helper para insertar o actualizar (upsert) un registro en la tabla
 * @param {string} tabla – nombre de la tabla
 * @param {Object} data – objeto con las columnas y valores a insertar/actualizar
 *                        Si incluye la PK, será un UPDATE en caso de conflicto;
 *                        de lo contrario, hará un INSERT normal.
 * @returns {Promise<Object|null>} – el registro insertado/actualizado (o null si DO NOTHING)
 */
async function agregar(tabla, data) {
  const client = await pool.connect();
  try {
    // Filtrar las entradas cuyo valor es undefined (para no incluir columnas con valor NULL involuntario)
    const entries = Object.entries(data).filter(([_, valor]) => valor !== undefined);
    if (entries.length === 0) {
      throw new Error('El objeto "data" no puede estar vacío o solo con valores undefined');
    }

    // Reconstruimos keys y valores a partir del filtrado
    const keys = entries.map(([clave]) => clave);
    const values = entries.map(([_, valor]) => valor);

    const pk = getPrimaryKey(tabla);

    // Construir lista de columnas: e.g. ["\"id_rsluser\"", "\"nombre_rsluser\"", ...]
    const columns = keys.map((k) => `"${k}"`).join(', ');

    // Construir placeholders: $1, $2, ...
    const placeholders = keys.map((_, idx) => `$${idx + 1}`).join(', ');

    // Construir cláusula de actualización: excluimos la PK (no se actualiza)
    const updateCols = keys
      .filter((k) => k !== pk)
      .map((k) => `"${k}" = EXCLUDED."${k}"`)
      .join(', ');

    // Si no hay columnas para actualizar (porque solo se envió pk), hacemos DO NOTHING
    const onConflict = updateCols
      ? `ON CONFLICT ("${pk}") DO UPDATE SET ${updateCols}`
      : `ON CONFLICT ("${pk}") DO NOTHING`;

    const queryText = `
      INSERT INTO ${tabla} (${columns})
      VALUES (${placeholders})
      ${onConflict}
      RETURNING *;
    `;

    const res = await client.query(queryText, values);
    // Si fue INSERT o UPDATE, res.rows[0] contendrá el registro.
    // Si DO NOTHING (conflict sin actualización), res.rows.length === 0.
    return res.rows.length > 0 ? res.rows[0] : null;
  } catch (error) {
    return Promise.reject(error);
  } finally {
    client.release();
  }
}

/**
 * Helper para eliminar un registro por su clave primaria
 * @param {string} tabla – nombre de la tabla
 * @param {Object} data – objeto que debe contener al menos la propiedad con la PK
 * @returns {Promise<number>} – número de filas eliminadas
 */
async function eliminar(tabla, data) {
  const client = await pool.connect();
  try {
    const pk = getPrimaryKey(tabla);
    if (data[pk] === undefined) {
      throw new Error(`Debe proporcionar la propiedad "${pk}" en el objeto data`);
    }
    const res = await client.query(
      `DELETE FROM ${tabla} WHERE "${pk}" = $1`,
      [data[pk]]
    );
    return res.rowCount; // número de filas eliminadas (0 o 1)
  } catch (error) {
    return Promise.reject(error);
  } finally {
    client.release();
  }
}

/**
 * Helper para hacer una consulta dinámica con condiciones a partir de un objeto
 * Ej: query('rsluser', { ciudad_rsluser: 'Tijuana', activo: true })
 * construye: SELECT * FROM rsluser WHERE "ciudad_rsluser" = $1 AND "activo" = $2
 *
 * @param {string} tabla – nombre de la tabla
 * @param {Object} condiciones – objeto con pares { columna: valor }
 * @returns {Promise<Array>} – filas que coinciden con las condiciones
 */
async function query(tabla, condiciones) {
  const client = await pool.connect();
  try {
    const keys = Object.keys(condiciones);
    if (keys.length === 0) {
      const res = await client.query(`SELECT * FROM ${tabla}`);
      return res.rows;
    }
    // Construir cláusula WHERE: e.g. "\"col1\" = $1 AND \"col2\" = $2"
    const whereClauses = keys
      .map((k, idx) => `"${k}" = $${idx + 1}`)
      .join(' AND ');
    const values = keys.map((k) => condiciones[k]);

    const res = await client.query(
      `SELECT * FROM ${tabla} WHERE ${whereClauses}`,
      values
    );
    return res.rows;
  } catch (error) {
    return Promise.reject(error);
  } finally {
    client.release();
  }
}

module.exports = {
  todos,
  uno,
  agregar,
  eliminar,
  query,
};
