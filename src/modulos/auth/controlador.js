// src/modulos/auth/controlador.js
const bcrypt = require('bcrypt');
const auth = require('../../auth');
const config = require('../../config');

const TABLA = 'rslauth';
const SALT_ROUNDS = 10;

module.exports = function (dbInyectada) {
  const db = dbInyectada || require('../../DB/mysql');

  /**
   * Realiza el login del usuario, genera el token y lo guarda en una cookie.
   *
   * @param {string} usuario_rslauth – el nombre de usuario en rslauth
   * @param {string} password – la contraseña sin hashear
   * @param {Object} res – el objeto de respuesta de Express
   *
   * @throws {Error} si no encuentra al usuario, la contraseña no coincide, o hay otro error.
   */
  async function login(usuario_rslauth, password, res) {
    try {
      // 1️⃣ Buscar por columna usuario_rslauth
      const [user] = await db.query(TABLA, { usuario_rslauth });
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // 2️⃣ Comparar password con password_rslauth hasheado
      const isMatch = await bcrypt.compare(password, user.password_rslauth);
      if (!isMatch) {
        throw new Error('Credenciales inválidas');
      }

      // 3️⃣ Construir payload con idrsluser_rslauth y usuario_rslauth
      //    Observa que en la tabla rslauth la FK se llama "idrsluser_rslauth"
      const payload = {
        id_rsluser: user.idrsluser_rslauth,
        usuario_rslauth: user.usuario_rslauth,
        admin_rslauth: user.admin_rslauth
      };
      const token = auth.asignarToken(payload);

      // 4️⃣ Configurar cookie con el JWT
      const cookieOptions = {
        expires: new Date(Date.now() + config.jwt.cookieExpires * 24 * 60 * 60 * 1000),
        httpOnly: true,
        path: '/'
      };
      res.cookie('jwt', token, cookieOptions);
      // Opcionalmente puedes devolver un JSON de éxito aquí
      return res.json({ success: true, token });;
    } catch (error) {
      throw new Error(`Error en login: ${error.message}`);
    }
  }

  /**
   * Agrega un nuevo registro en rslauth.
   *
   * @param {Object} data – Debe contener:
   *   • idrsluser_rslauth   (integer, obligatorio; FK a rsluser.id_rsluser)
   *   • usuario_rslauth     (string, obligatorio; nombre de usuario)
   *   • correo_rslauth      (string, obligatorio; email)
   *   • password_rslauth    (string, obligatorio; contraseña sin hashear)
   *   • admin_rslauth       (smallint 0/1 o boolean, opcional; default = 0)
   *
   * @returns {Promise<Object|null>} – el registro creado (o null si hubo conflicto DO NOTHING)
   *
   * @throws {Error} 'Datos requeridos faltantes' si faltan campos esenciales
   */
  async function agregar(data) {
    const {
      idrsluser_rslauth,
      usuario_rslauth,
      correo_rslauth,
      password_rslauth,
      admin_rslauth
    } = data;

    // 1️⃣ Validar que existan idrsluser_rslauth y password_rslauth
    if (
      idrsluser_rslauth === undefined ||
      idrsluser_rslauth === null ||
      password_rslauth === undefined ||
      password_rslauth.toString().trim() === ''
    ) {
      throw new Error('Datos requeridos faltantes');
    }

    // 2️⃣ Preparar el objeto para insertar en rslauth
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
      admin_rslauth: admin_rslauth != null ? admin_rslauth : 0
    };

    // 3️⃣ Insertar en la tabla rslauth
    //    db.agregar usará ON CONFLICT(id_rslauth) DO NOTHING o DO UPDATE según corresponda
    const result = await db.agregar(TABLA, authData);
    return result;
  }

  return {
    login,
    agregar
  };
};
