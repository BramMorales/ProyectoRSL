const express = require('express');
const router = express.Router();
const controlador = require('./index');

// GET /
router.get('/', async (req, res, next) => {
    try{
        const items = await controlador.todos();
        return res.status(200).json({
            code: 'succes',
            message: items
        });
    }
    catch(err)
    {
        next(err);
    }
});

module.exports = router;
