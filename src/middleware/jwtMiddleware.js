const jwt = require("jsonwebtoken");
const config = require("../config");

//Decodifica token jwt, para la extracción de atributos importantes
const jwtMiddleware = (req, res, next) => {
  res.locals.usuario = null;

  //Consulta el token
  const token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      req.user = decoded;
      res.locals.usuario = decoded.usuario;
    } catch (err) {
      console.error("Token inválido:", err.message);
    }
  }

  next();
};

module.exports = jwtMiddleware;
