const bcrypt = require('bcrypt');
const auth = require('../../auth');
const config = require('../../config');
const respuesta = require('../../red/respuestas');

const TABLA = 'rslauth';
const SALT_ROUNDS = 10;

module.exports = function (dbInyectada) {
  const db = dbInyectada || require('../../DB/mysql');

  async function login(usuario_rslauth, password, res) {
    try {
      // Valida que exista un usuario
      const [user] = await db.query(TABLA, { usuario_rslauth });
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Valida que el correo esté verificado
      if(user.verificadocorreo_rslauth === 0)
      {
        throw new Error('Usuario no validado');
      }

      // Comparar password con password_rslauth hasheado
      const isMatch = await bcrypt.compare(password, user.password_rslauth);
      if (!isMatch) {
        throw new Error('Credenciales inválidas');
      }

      // Construir payload para el token
      const payload = {
        id_rsluser: user.idrsluser_rslauth,
        usuario_rslauth: user.usuario_rslauth,
        admin_rslauth: user.admin_rslauth,
        verificadocorreo_rslauth: user.verificadocorreo_rslauth,
      };
      const token = auth.asignarToken(payload);

      // Configurar cookie con el JWT
      const cookieOptions = {
        expires: new Date(Date.now() + config.jwt.cookieExpires * 24 * 60 * 60 * 1000),
        httpOnly: true,
        path: '/'
      };
      res.cookie('jwt', token, cookieOptions);

      return  token;
    } catch (error) {
      throw new Error(`Error en login: ${error.message}`);
    }
  }

  async function agregar(data) {
    const {
      idrsluser_rslauth,
      usuario_rslauth,
      correo_rslauth,
      password_rslauth,
      admin_rslauth,
      verificadocorreo_rslauth,
    } = data;

    // Validar que existan idrsluser_rslauth y password_rslauth
    if (
      idrsluser_rslauth === undefined ||
      idrsluser_rslauth === null ||
      password_rslauth === undefined ||
      password_rslauth.toString().trim() === ''
    ) {
      throw new Error('Datos requeridos faltantes');
    }

    // Preparar el objeto para insertar en rslauth
    const hashedPassword = await bcrypt.hash(password_rslauth.toString(), SALT_ROUNDS);

    const authData = {
      // Aquí usamos exactamente la columna "idrsluser_rslauth" que definiste en la tabla
      idrsluser_rslauth: idrsluser_rslauth,

      // Si usuario_rslauth o correo_rslauth vienen undefined, asignar null
      usuario_rslauth: usuario_rslauth != null ? usuario_rslauth : null,
      correo_rslauth: correo_rslauth != null ? correo_rslauth : null,

      // Hashear la contraseña
      password_rslauth: hashedPassword,

      // admin_rslauth: si viene undefined, forzar a 0; si viene 1/0 o booleano, respetar
      admin_rslauth: admin_rslauth != null ? admin_rslauth : 0,

      verificadocorreo_rslauth: verificadocorreo_rslauth != null ? verificadocorreo_rslauth : 0
    };

    //  Insertar en la tabla rslauth
    const result = await db.agregar(TABLA, authData);
    return result;
  }

  async function actualizar(id, data) {
    const result = await db.actualizar(TABLA, id, data);
    return result;
  }

  return {
    login,
    agregar, 
    actualizar
  };
};
