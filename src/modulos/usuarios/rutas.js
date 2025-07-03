// Importar
const express = require('express');
const router = express.Router();
const respuesta = require('../../red/respuestas');
const controlador = require('./index');
const config = require('../../config');
 
// Rutas
router.get('/buscar', query);
router.get('/verificacion/:token', verificar);
router.get('/:especialidad/:verificado', and);
router.get('/:id', uno);

router.post('/', agregar);
router.post("/recuperar", solicitarRecuperacion);
router.post("/restablecer", restablecerContrasena);

router.put('/modificar', modificar);
router.put('/', eliminar);

// Funciones
async function uno(req, res, next) {
    try {
        const item = await controlador.uno(req.params.id);
        respuesta.success(req, res, item, 200);
    } catch (err) {
        respuesta.error(req, res, err.message, 500);
    }
}

async function verificar(req, res, next) {
    try {
        const item = await controlador.verificar(req, res); 
        res.cookie('jwt', item.token, item.cookieOptions);
        res.redirect(`${config.host.client}/`);
        respuesta.success(req, res, {token: item.token}, 200);
    } catch (err) {
        respuesta.error(req, res, err.message, 500);
    }
}

async function solicitarRecuperacion(req, res) {
  try {
    const { correo } = req.body;

    const item = await controlador.solicitarRecuperacion(correo);
    respuesta.success(req, res, item, 200);
  } catch (err) {
    respuesta.error(req, res, err.message, 500);
  }
}

async function restablecerContrasena(req, res) {
  try {
    const { token, nuevaContrasena } = req.body;
    
    const item = await controlador.restablecerContrasena(token, nuevaContrasena);
    respuesta.success(req, res, item, 200);
  } catch (err) {
    respuesta.error(req, res, err.message, 400);
  }
}


async function query(req, res, next) {
    try {
        const filtros = {};
        if (req.query.experticia) filtros.experticia_rsluser = req.query.experticia;
        if (req.query.lugar)       filtros.ciudad_rsluser      = req.query.lugar;
        filtros.verificadoadmin_rsluser = 1;

        const item = await controlador.and(filtros);
        respuesta.success(req, res, item, 200);
    } catch (err) {
        respuesta.error(req, res, err.message, 500);
    }
}

async function and(req, res, next) {
    try {
        const condiciones = {
            especialidad_rsluser: req.params.especialidad,
            verificadoadmin_rsluser: req.params.verificado,
        };

        const item = await controlador.and(condiciones);
        respuesta.success(req, res, item, 200);
    } catch (err) {
        respuesta.error(req, res, err.message, 500);
    } 
}

async function eliminar(req, res, next) {
    try {
        const result = await controlador.eliminar(req.body);
        respuesta.success(req, res, { eliminado: true, result }, 200);
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

async function agregar(req, res, next) {
    try {
        const result = await controlador.agregar(req, res, req.body);
        const mensaje = req.body.id == 0
            ? "Item guardado con éxito"
            : "Item actualizado con éxito";

        respuesta.success(req, res, { mensaje, id: result?.id || req.body.id }, 201);
    } catch (err) {
        respuesta.error(req, res, err.message, 500);
    }
}

// Exportar router
module.exports = router;
