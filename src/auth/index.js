//Exportar librerías y variables de entorno
const jwt = require('jsonwebtoken');
const config = require('../config');
const { secret, expiration } = config.jwt;

function asignarToken(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Datos inválidos para generar el token.');
  }

  try {
    //Generador Token
    return jwt.sign(data, secret, { expiresIn: expiration });
  } catch (err) {
    console.error('Error al generar el token:', err.message);
    throw new Error('No se pudo generar el token.');
  }
}

module.exports = {
  asignarToken,
};
