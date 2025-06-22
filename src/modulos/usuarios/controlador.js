// src/modulos/usuarios/controlador.js
const TABLA = 'rsluser';
const auth = require('../auth');

module.exports = function (dbInyectada) {
  const db = dbInyectada || require('../../DB/mysql');

  /**
   * Obtiene todos los usuarios cuya experticia coincida con body.que
   */
  async function todos(_, body) {
    if (!body.que) {
      throw new Error("Falta el campo 'que'");
    }

    // Usamos experticia_rsluser en lugar de “experticia”
    const resultados = await db.query(TABLA, { experticia_rsluser: body.que });

    // Mapea cada registro y convierte el BLOB a Data-URL
    const usuariosConLogo = resultados.map(u => {
      let logoDataUrl = 'default.png';

      // Si u.logourl_rsluser es un Buffer real y tiene contenido…
      if (u.logourl_rsluser && Buffer.isBuffer(u.logourl_rsluser) && u.logourl_rsluser.length) {
        const base64 = u.logourl_rsluser.toString('base64');
        logoDataUrl = `data:image/jpeg;base64,${base64}`;
      }

      return {
        ...u,
        // Renombramos la propiedad para que el frontend reciba “logo”
        logo: logoDataUrl
      };
    });

    return usuariosConLogo;
  }

  /**
   * Obtiene un solo usuario por su id_rsluser
   */
  function uno(id_rsluser) {
    return db.uno(TABLA, id_rsluser);
  }

  /**
   * Elimina un usuario por su id_rsluser
   */
  function eliminar(body) {
    // body debe contener { id_rsluser: <valor> }
    return db.eliminar(TABLA, body);
  }

  /**
   * Agrega un nuevo usuario (en rsluser) y, si se proporcionan credenciales,
   * crea también el registro en rslauth.
   */
  async function agregar(res, body) {
    // Campos para rslauth
    const { usuario_rslauth, correo_rslauth, password_rslauth, admin_rslauth } = body;

    // 1️⃣ Validaciones de unicidad en tabla rslauth
    if (usuario_rslauth) {
      const existingUser = await db.query('rslauth', { usuario_rslauth });
      if (existingUser.length !== 0) {
        return res.status(409).json({
          code: 'USER_TAKEN',
          message: 'Usuario ya existe, banda'
        });
      }
    }

    if (correo_rslauth) {
      const existingEmail = await db.query('rslauth', { correo_rslauth });
      if (existingEmail.length !== 0) {
        return res.status(409).json({
          code: 'EMAIL_TAKEN',
          message: 'Correo ya existe, banda'
        });
      }
    }

    // 2️⃣ Construcción del objeto para insertar en rsluser
    const usuarioNuevo = {
      // Si body.id_rsluser viene como 0 o undefined, omitimos para que PostgreSQL lo auto‐incremente
      id_rsluser: body.id_rsluser && body.id_rsluser !== 0
        ? body.id_rsluser
        : undefined,

      nombre_rsluser: body.nombre_rsluser,
      ciudad_rsluser: body.ciudad_rsluser,
      especialidad_rsluser: body.especialidad_rsluser,
      experticia_rsluser: body.experticia_rsluser,
      direccion_rsluser: body.direccion_rsluser,
      paginaweb_rsluser: body.paginaweb_rsluser,
      telefono_rsluser: body.telefono_rsluser,
      whatsapp_rsluser: body.whatsapp_rsluser,
      bio_rsluser: body.bio_rsluser,
      estado_rsluser: body.estado_rsluser,
      facebook_rsluser: body.facebook_rsluser,
      instagram_rsluser: body.instagram_rsluser,
      linkedin_rsluser: body.linkedin_rsluser,
      youtube_rsluser: body.youtube_rsluser,
      twitter_rsluser: body.twitter_rsluser,
      logourl_rsluser: body.logourl_rsluser,
      perfilurl_rsluser: body.perfilurl_rsluser,
      verificado_rsluser: body.verificado_rsluser
    };

    // 3️⃣ Inserta en rsluser y obtiene el nuevo PK “id_rsluser”
    //    db.agregar debe usar “RETURNING id_rsluser” internamente
    const result = await db.agregar(TABLA, usuarioNuevo);
    const insertId = result ? result.id_rsluser : null;

    // 4️⃣ Si se proporcionaron credenciales, insertamos en rslauth
    if (usuario_rslauth || correo_rslauth || password_rslauth) {
        await auth.agregar({
            idrsluser_rslauth: insertId,       // <-- aquí debe ir exactamente ese nombre
            usuario_rslauth:   body.usuario_rslauth,
            correo_rslauth:    body.correo_rslauth,
            password_rslauth:  body.password_rslauth,
            admin_rslauth:     body.admin_rslauth || 0
        });

    }

    return { message: 'Usuario agregado exitosamente', id: insertId };
  }

  return {
    todos,
    uno,
    eliminar,
    agregar
  };
};
