const TABLA = 'rslespecialidad';

module.exports = function (dbInyectada){

    let db = dbInyectada;

    if(!db){
        db = require('../../DB/mysql');
    }

    function todos()
    {
        return db.todos(TABLA);
    }

    function uno(id_rslespecialidad)
    {
        return db.query(TABLA, {id_rslespecialidad: id_rslespecialidad});
    }

    function eliminar(id_rslespecialidad)
    {
        return db.eliminar(TABLA, {id_rslespecialidad: id_rslespecialidad});
    }

    function agregar(body)
    {
        return db.agregar(TABLA, body);
    }
    
    return {
        todos,
        uno,
        eliminar,
        agregar,
    }
}