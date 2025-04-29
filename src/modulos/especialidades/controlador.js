const config = require('../../config');

const TABLA = 'rslespecialidad';
const SALT_ROUNDS = 10;

module.exports = function (dbInyectada) {
    const db = dbInyectada || require('../../DB/mysql');

    /**
     * Realiza la consulta de las especialidades.
     */
    async function todos() {
        return db.todos(TABLA);
    }

    /**
     * Agrega una nueva especialidad con contraseña hasheada.
     */
    async function agregar(data) {
        
    }

    return {
        todos
    };
}
