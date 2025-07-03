const express = require('express');
const router = express.Router();
const controlador = require('./index');
const respuesta = require('../../red/respuestas')


router.post('/login', login);
router.post('/logout', logout);

async function login (req, res) {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return respuesta.error(req, res, '¡Usuario o contraseña requerido!', 400);
    }

    try {
        const token = await controlador.login(usuario, password, res);
        respuesta.success(req, res, token, 200)
    } 
    catch (err) {
        respuesta.error(req, res, err.message, 401)
    }
}

async function logout(req, res) {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: true,      
    sameSite: 'Lax',    
    path: '/',
  });
  respuesta.success(req, res, '¡Sesión cerrada con éxito!', 200)
}
module.exports = router;
