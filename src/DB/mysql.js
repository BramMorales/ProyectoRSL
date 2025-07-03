const { Pool } = require('pg');
const config = require('../config');

//Configuración de la base de datos
const pool = new Pool({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
});

//Mapeo de claves primarias según la tabla
function getPrimaryKey(tabla) {
  const claves = {
    rsluser: 'id_rsluser',
    rslauth: 'id_rslauth',
    rslespecialidad: 'id_rslespecialidad',
    rslpublicacion: 'id_rslpublicacion',
    // Agrega más tablas y sus claves aquí según las que tengas
  };

  if (!claves[tabla]) {
    throw new Error(`No se definió clave primaria para la tabla "${tabla}"`);
  }

  return claves[tabla];
}

// Manejo de errores de conexión en el pool
pool.on('error', (err) => {
  console.error('[db err]', err);
});

//Notificación de BD funcional
(async () => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('✅ Base de datos lista (PostgreSQL)');
  } catch (err) {
    console.error('❌ Error al conectar con la base de datos:', err.message);
  }
})();

async function todos(tabla) {
  const client = await pool.connect();
  try {
    const res = await client.query(`SELECT * FROM ${tabla}`);
    return res.rows;
  } catch (error) {
    return Promise.reject(error);
  } finally {
    client.release();
  }
}

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

async function and(tabla, conds) {
  const client = await pool.connect();
  try {
    // Extrae las claves y valores
    const keys   = Object.keys(conds);
    const values = Object.values(conds);

    if (keys.length === 0) {
      throw new Error("Se requiere al menos una condición para and()");
    }

    // Construye dinámicamente la cláusula WHERE:
    const whereClauses = keys
      .map((k, i) => `"${k}" = $${i + 1}`)
      .join(" AND ");

    const sql = `
      SELECT *
      FROM ${tabla}
      WHERE ${whereClauses}
    `;

    const res = await client.query(sql, values);
    return res.rows || null;
  } catch (error) {
    return Promise.reject(error);
  } finally {
    client.release();
  }
}

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

    // Construir lista de columnas
    const columns = keys.map((k) => `"${k}"`).join(', ');

    // Construir placeholders
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

async function query(tabla, condiciones = {}) {
  const client = await pool.connect();
  try {
    const keys = Object.keys(condiciones);

    // Si no hay filtros, devuelve todo:
    if (keys.length === 0) {
      const res = await client.query(`SELECT * FROM ${tabla}`);
      return res.rows;
    }

    // Construye cláusulas WHERE dinámicas con unaccent():
    const whereClauses = keys
      .map((col, idx) => {
        const placeholder = `$${idx + 1}`;
        if (typeof condiciones[col] === "string") {
          // unaccent(columna) ILIKE unaccent(patron)
          return `unaccent("${col}") ILIKE unaccent(${placeholder})`;
        } else {
          return `"${col}" = ${placeholder}`;
        }
      })
      .join(" AND ");

    // Prepara los valores para los placeholders:
    const values = keys.map((col) => {
      if (typeof condiciones[col] === "string") {
        // búsqueda parcial + quitar tildes
        return `%${condiciones[col]}%`;
      } else {
        return condiciones[col];
      }
    });

    // Ejecuta la consulta parametrizada:
    const sql = `SELECT * FROM ${tabla} WHERE ${whereClauses}`;
    const res = await client.query(sql, values);
    return res.rows;
  } finally {
    client.release();
  }
}

async function actualizar(tabla, id, cambios) {
  const client = await pool.connect();
  try {
    const pk = getPrimaryKey(tabla);
    const keys = Object.keys(cambios);
    const values = Object.values(cambios);

    if (keys.length === 0) {
      throw new Error('No hay datos para actualizar');
    }

    const setClause = keys
      .map((key, i) => `"${key}" = $${i + 1}`)
      .join(', ');

    const query = `
      UPDATE ${tabla}
      SET ${setClause}
      WHERE "${pk}" = $${keys.length + 1}
      RETURNING *;
    `;

    const res = await client.query(query, [...values, id]);
    return res.rows[0] || null;
  } finally {
    client.release();
  }
}

module.exports = {
  todos,
  uno,
  and,
  agregar,
  eliminar,
  query,
  actualizar
};
