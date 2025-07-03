const TABLA = 'rsluser';
const bcrypt = require('bcrypt');
const auth = require('../auth');
const jwt = require('../../auth');
const mailer = require('../../services/mail.service');
const config = require('../../config');
const jsonwt = require('jsonwebtoken');
const respuesta = require('../../red/respuestas')

module.exports = function (dbInyectada) {
  const db = dbInyectada || require('../../DB/mysql');

  function uno(id_rsluser) {
    return db.uno(TABLA, id_rsluser); 
  }

  function query(condiciones) {
    return db.query(TABLA, condiciones); 
  }

   function and(condiciones) {
    return db.and(TABLA, condiciones);
  }

  function eliminar(body) {
    return db.eliminar(TABLA, body);
  }

  async function agregar(req, res, body) {
    // Campos para rslauth
    const { usuario_rslauth, correo_rslauth, password_rslauth, admin_rslauth } = body;

    // Validaciones de unicidad en tabla rslauth
    if (usuario_rslauth) {
      const existingUser = await db.query('rslauth', { usuario_rslauth });
      if (existingUser.length !== 0) {
        throw new Error('Usuario ya existente');
      }
    }

    if (correo_rslauth) {
      const existingEmail = await db.query('rslauth', { correo_rslauth });
      if (existingEmail.length !== 0) {
        throw new Error('Correo ya existe');
      }
    }

    // Construcción del objeto para insertar en rsluser
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
      contactopreferido_rsluser: body.contactopreferido_rsluser,
      logourl_rsluser: body.logourl_rsluser,
      perfilurl_rsluser: body.perfilurl_rsluser,
      verificadoadmin_rsluser: body.verificadoadmin_rsluser
    };
    
    const result = await db.agregar(TABLA, usuarioNuevo);
    const insertId = result ? result.id_rsluser : null;

    const payload = {
      id_rsluser: insertId,
      usuario_rslauth: body.usuario_rslauth,
      admin_rslauth: body.admin_rslauth,
      verificadocorreo_rslauth: body.verificadocorreo_rslauth,
    };
          
    const tokenVerificacion = jwt.asignarToken(payload);

    const mail = await mailer.enviarMailVerificacion(body.correo_rslauth, tokenVerificacion);
    if(mail.accepted === 0){
      throw new Error("Error enviando mail de verificación");
    }

    //  Si se proporcionaron credenciales, insertamos en rslauth
    if (usuario_rslauth || correo_rslauth || password_rslauth) {
        await auth.agregar({
            idrsluser_rslauth: insertId,      
            usuario_rslauth:   body.usuario_rslauth,
            correo_rslauth:    body.correo_rslauth,
            password_rslauth:  body.password_rslauth,
            admin_rslauth:     body.admin_rslauth || 0,
            verificadocorreo_rslauth: body.verificadocorreo_rslauth || 0,
        }, res);

    }

    return { mensaje: 'Usuario agregado exitosamente', id: insertId };
  }

  async function verificar(req) {
    const tokenParam = req.params.token;

    if (!tokenParam) {
      throw new Error("No hay token");
    }

    const decoded = jsonwt.verify(tokenParam, config.jwt.secret);

    if (!decoded || !decoded.usuario_rslauth) {
      throw new Error("Token inválido");
    }

    const payload = {
      id_rsluser: decoded.id_rsluser,
      usuario_rslauth: decoded.usuario_rslauth,
      admin_rslauth: decoded.admin_rslauth,
      verificadocorreo_rslauth: decoded.verificadocorreo_rslauth,
    };

    const nuevoToken = jwt.asignarToken(payload);

    const rslauth = await db.query('rslauth', {idrsluser_rslauth: decoded.id_rsluser}); ; 
    
    await auth.actualizar(
      rslauth[0].id_rslauth, {
      verificadocorreo_rslauth: 1
      }
    );

    return {
      token: nuevoToken,
      cookieOptions: {
        expires: new Date(Date.now() + config.jwt.cookieExpires * 24 * 60 * 60 * 1000),
        httpOnly: true,
        path: '/'
      }
    };
}

async function modificar(id, data) {
    const result = await db.actualizar(TABLA, id, data);
    return result;
}

async function solicitarRecuperacion(correo) {
  const usuario = await db.query("rslauth", { correo_rslauth: correo }); 
  
  if (!usuario) {
    return respuesta.error(req, res, "Correo no registrado", 404);
  }
  
  payload = {
    id_rslauth: usuario[0].id_rslauth,
    usuario_rslauth: usuario[0].usuario_rslauth,
    admin_rslauth: usuario[0].admin_rslauth,
  }

  const token = jwt.asignarToken(payload);
  
  const mail = await mailer.enviarMailReestablecer(correo, token);
  return mail;
}

async function restablecerContrasena(token, nuevaContrasena) {
  if (!token || !nuevaContrasena) {
    throw new Error("Token o nueva contraseña faltante");
  }
  
  const decoded = jsonwt.verify(token, config.jwt.secret);
  const id = decoded.id_rslauth;
  const hashedPassword = await bcrypt.hash(nuevaContrasena.toString(), 10);

  try{
    const contrasena = await db.actualizar("rslauth", id, { password_rslauth: hashedPassword });
    return contrasena
  }catch (error) {
    throw new Error("Error al actualizar la contraseña: " + error.message);
  }
}

  return {
    uno,
    query,
    and,
    eliminar,
    agregar, 
    verificar,
    modificar,
    solicitarRecuperacion,
    restablecerContrasena
  };
};
