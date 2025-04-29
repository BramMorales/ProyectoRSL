const express = require('express');
const router = express.Router();
const controlador = require('./index');

// POST /login
router.post('/login', async (req, res, next) => {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    try {
        await controlador.login(usuario, password, res); // El controlador se encarga de enviar la cookie
        res.status(200).json({ mensaje: 'Login exitoso' }); // No es necesario devolver el token si va en cookie
    } catch (err) {
        console.error('Error en login:', err.message);
        res.status(401).json({ error: err.message });
    }
});

module.exports = router;
