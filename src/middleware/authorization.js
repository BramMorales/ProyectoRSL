const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const config = require('../config');
const db = require('../DB/mysql');

dotenv.config();

const TABLA = 'rslauth';

/**
 * Middleware que permite el acceso solo a usuarios autenticados.
 */
async function soloUsuarios(req, res, next) {
    const log = await revisarCookie(req);
    if (log) return next();
    return res.redirect("/Inicio");
}

/**
 * Middleware que permite el acceso solo a usuarios NO autenticados.
 */
async function soloNoUsuarios(req, res, next) {
    const log = await revisarCookie(req);
    if (!log) return next();
    return res.redirect("/Main");
}

/**
 * Revisa la cookie JWT, verifica el token y valida que el usuario exista en la base de datos.
 * @param {Request} req 
 * @returns {Promise<boolean>}
 */
async function revisarCookie(req) {
    try {
        const cookies = req.headers.cookie;
        if (!cookies) return false;

        const jwtCookie = cookies
            .split(";")
            .map(c => c.trim())
            .find(cookie => cookie.startsWith("jwt="));

        if (!jwtCookie) return false;

        const token = jwtCookie.split("=")[1];
        const decoded = jwt.verify(token, config.jwt.secret);

        const [usuarioActivo] = await db.query(TABLA, { usuario: decoded.usuario });

        return !!usuarioActivo;
    } catch (error) {
        console.error("Error revisando cookie:", error.message);
        return false;
    }
}

module.exports = {
    soloUsuarios,
    soloNoUsuarios,
};
