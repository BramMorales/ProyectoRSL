const path = require('path');
const { fileURLToPath } = require('url');

const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('./config');
const cookieParser = require('cookie-parser');

const usuarios = require('./modulos/usuarios/rutas');
const auth = require('./modulos/auth/rutas');
const especialidades = require('./modulos/especialidades/rutas');
const authorization = require('./middleware/authorization');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.set('port', config.app.port);
app.set('view engine', 'ejs');

//Configuracion
app.use(express.static(__dirname + '/public/js'));
app.use(express.static(__dirname + '/public/css'));
app.use(express.static(__dirname + '/public/img'));
app.set('views', path.join(__dirname, '/public/views'));

app.use((req, res, next) => {
  res.locals.usuario = null; // ← esta línea es clave

  const token = req.cookies.jwt;
  if (token) {
    try {
      res.locals.usuario = jwt.verify(token, config.jwt.secret);
    } catch {
      // si falla el token, seguimos con usuario = null
    }
  }

  next();
});

//RutasHTML
app.get("/api/v1/Registro", authorization.soloNoUsuarios,(req,res)=>{res.render('registro')});
app.get("/Inicio", (req,res)=>{res.render('index')});
app.get("/Main", authorization.soloUsuarios,(req,res)=>{res.render('mainpage')});
app.get("/Busqueda",(req,res)=>{res.render('busqueda')});

//RutasAPI 
app.use('/api/usuarios', usuarios);
app.use('/api/auth', auth);
app.use('/api/especialidades', especialidades);

app.post("/api/usuarios/consulta", async (req, res, next) => {
  try {
    const resultados = await obtenerUsuariosDeDB(req.body);
    const usuariosConLogo = resultados.map(u => {
      let logoDataUrl = "/img/default.png";
      if (u.logo && Buffer.isBuffer(u.logo) && u.logo.length) {
        // convierte el Buffer a base64
        const base64 = u.logo.toString("base64");
        // ajusta el MIME según tu almacenamiento (png, jpeg…)
        logoDataUrl = `data:image/png;base64,${base64}`;
      }
      return {
        ...u,
        logo: logoDataUrl
      };
    });
    res.json({ success: true, body: usuariosConLogo });
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message });
  });

module.exports = app;