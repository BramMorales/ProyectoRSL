//Importar
const express = require('express');
const router = express.Router();
const respuesta = require('../../red/respuestas');
const controlador = require('./index');
const { query } = require('../usuarios');

//Rutas
router.get('/', todos);
router.get('/:id_rslespecialidad', uno);
router.get('/verificados/:visible', visible);
router.post('/agregar', agregar);

router.put('/eliminar/:id_rslespecialidad', eliminar);
router.put('/modificar', modificar);

//Funciones
async function todos (req, res, next){
    try{
        const items = await controlador.todos();
        respuesta.success(req, res, items, 200);
    }
    catch(err)
    {
        respuesta.error(req, res, err.message, 401)
    }
};

async function uno(req, res, next){
    try{
        const items = await controlador.uno(req.params.id_rslespecialidad);
        respuesta.success(req, res, items, 200);
    }
    catch(err)
    {
        respuesta.error(req, res, err.message, 401)
    }
};

async function eliminar (req, res, next) {
    try{
        const items = await controlador.eliminar(req.params.id_rslespecialidad);
        respuesta.success(req, res, 'Item eliminado', 200);
    }
    catch (err) {
        respuesta.error(req, res, err.message, 401)
    }
};

async function agregar (req, res, next){
    try{
        const items = await controlador.agregar(req.body);
        req.body.id_rslespecialidad == 0 
            ? mensaje = "Item guardado con éxito" 
            : mensaje = "Item actualizado con éxito";
        respuesta.success(req, res, mensaje, 201);
    }
    catch(err)
    {
        respuesta.error(req, res, err.message, 401)
    }
};

async function visible(req, res, next) {
    try {
        const condiciones = {
            visible_rslpublicacion: req.params.visible,
        };

        const item = await controlador.query(condiciones);
        respuesta.success(req, res, item, 200);
    } catch (err) {
        respuesta.error(req, res, err.message, 500);
    } 
}

async function modificar(req, res, next){
    try{
        const { id_rsluser, ...data } = req.body;

        const result = await controlador.modificar(id_rsluser, data);
        respuesta.success(req, res, { modificado: true, result }, 200);
    }catch(err){
        respuesta.error(req, res, err.message, 500);
    }
}

//Valor devuelto
module.exports = router;