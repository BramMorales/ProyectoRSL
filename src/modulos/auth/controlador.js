const bcrypt = require('bcrypt');
const auth = require('../../auth');
const config = require('../../config');

const TABLA = 'rslauth';
const SALT_ROUNDS = 10;

module.exports = function (dbInyectada) {
    const db = dbInyectada || require('../../DB/mysql');

    /**
     * Realiza el login del usuario, genera el token y lo guarda en una cookie.
     */
    async function login(usuario, password, res) {
        try {
            const [user] = await db.query(TABLA, { usuario });

            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Credenciales inválidas');
            }

            const payload = { id: user.id, usuario: user.usuario };
            const token = auth.asignarToken(payload);

            const cookieOptions = {
                expires: new Date(Date.now() + config.jwt.cookieExpires * 24 * 60 * 60 * 1000),
                httpOnly: true,
                path: "/"
            };

            res.cookie("jwt", token, cookieOptions);
        } catch (error) {
            throw new Error(`Error en login: ${error.message}`);
        }
    }

    /**
     * Agrega un nuevo usuario con contraseña hasheada.
     */
    async function agregar(data) {
        if (!data.id || !data.password) {
            throw new Error('Datos requeridos faltantes');
        }

        const authData = {
            id: data.id,
            usuario: data.usuario || null,
            correo: data.correo || null,
            password: await bcrypt.hash(data.password.toString(), SALT_ROUNDS),
        };

        return db.agregar(TABLA, authData);
    }

    return {
        agregar,
        login
    };
}
