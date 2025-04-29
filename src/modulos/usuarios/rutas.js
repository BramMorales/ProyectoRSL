// Importar
const express = require('express');
const router = express.Router();
const respuesta = require('../../red/respuestas');
const controlador = require('./index');

// Rutas
router.post('/consulta', todos);
router.get('/:id', uno);
router.post('/', agregar);
router.put('/', eliminar);

// Funciones
async function todos(req, res, next) {
    try {
        const items = await controlador.todos(res, req.body);
        respuesta.success(req, res, items, 200);
    } catch (err) {
        next(err);
    }
}

async function uno(req, res, next) {
    try {
        const item = await controlador.uno(req.params.id);
        respuesta.success(req, res, item, 200);
    } catch (err) {
        next(err);
    }
}

async function eliminar(req, res, next) {
    try {
        const result = await controlador.eliminar(req.body);
        respuesta.success(req, res, { eliminado: true, result }, 200);
    } catch (err) {
        next(err);
    }
}

async function agregar(req, res, next) {
    try {
        const result = await controlador.agregar(res, req.body);
        const mensaje = req.body.id == 0
            ? "Item guardado con éxito"
            : "Item actualizado con éxito";

        respuesta.success(req, res, { mensaje, id: result?.id || req.body.id }, 201);
    } catch (err) {
        next(err);
    }
}

// Exportar router
module.exports = router;
