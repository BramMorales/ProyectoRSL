const jwt = require('jsonwebtoken');
const config = require('../config');

const { secret, expiration } = config.jwt;

/**
 * Genera un token JWT firmado con los datos proporcionados.
 * @param {Object} data - Datos a incluir en el payload del token.
 * @returns {string} Token JWT firmado.
 * @throws {Error} Si los datos no son válidos o falla la firma.
 */
function asignarToken(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Datos inválidos para generar el token.');
  }

  try {
    return jwt.sign(data, secret, { expiresIn: expiration });
  } catch (err) {
    console.error('Error al generar el token:', err.message);
    throw new Error('No se pudo generar el token.');
  }
}

module.exports = {
  asignarToken,
};
