const TABLA = 'rslpublicacion';

module.exports = function (dbInyectada){

    let db = dbInyectada;

    if(!db){
        db = require('../../DB/mysql');
    }

    function todos()
    {
        return db.todos(TABLA);
    }

    function uno(id_rslpublicacion)
    {
        return db.uno(TABLA, id_rslpublicacion);
    }

    function eliminar(id_rslpublicacion)
    {
        return db.eliminar(TABLA, {id_rslpublicacion: id_rslpublicacion});
    }

    function agregar(body)
    {
        return db.agregar(TABLA, body);
    }
    
    function query(condiciones) {       
    return db.and(TABLA, condiciones); 
  }
 
  async function modificar(id, data) {
    const result = await db.actualizar(TABLA, id, data);
    return result;
}

    return {
        todos,
        query,
        uno,
        eliminar,
        agregar,
        modificar
    }
}