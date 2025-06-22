// middleware/jwtMiddleware.js
const jwt = require("jsonwebtoken");
const config = require("../config");

const jwtMiddleware = (req, res, next) => {
  res.locals.usuario = null;

  const token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      req.user = decoded;
      res.locals.usuario = decoded.usuario; // Por si necesitas mostrarlo en plantillas
    } catch (err) {
      console.error("Token inválido:", err.message);
    }
  }

  next();
};

module.exports = jwtMiddleware;
