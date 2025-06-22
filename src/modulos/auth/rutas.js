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
        } catch (err) {
        console.error('Error en login:', err.message);
        res.status(401).json({ error: err.message });
    }
});

router.post('/logout', (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: true,       // o false si estás en localhost sin HTTPS
    sameSite: 'Lax',    // o 'None' si estás usando cross-origin con credentials
    path: '/',
  });
  res.status(200).json({ mensaje: 'Sesión cerrada' });
});


module.exports = router;
