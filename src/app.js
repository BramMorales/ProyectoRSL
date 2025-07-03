const path = require('path');
const express = require('express');
const jwtMiddleware = require("./middleware/jwtMiddleware");
const config = require('./config');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const usuarios = require('./modulos/usuarios/rutas');
const auth = require('./modulos/auth/rutas');
const especialidades = require('./modulos/especialidades/rutas');
const publicaciones = require('./modulos/publicaciones/rutas');
const uploadRoutes = require('./modulos/uploads/rutas');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.set('port', config.app.port);
app.set('view engine', 'ejs');

app.use(cors({
  origin: config.host.client, // <-- permite tu frontend
  credentials: true // <-- si usas cookies o cabeceras de autenticación
}));

app.use(jwtMiddleware);

app.get("/api/auth/me", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "No autenticado" });
  }
  
  res.json({ id_rsluser: req.user.id_rsluser, usuario_rslauth: req.user.usuario_rslauth, admin_rslauth: req.user.admin_rslauth, verificadocorreo_rslauth: req.user.verificadocorreo_rslauth });
});

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

//RutasAPI 
app.use('/api/usuarios', usuarios);
app.use('/api/auth', auth);
app.use('/api/especialidades', especialidades);
app.use('/api/publicaciones', publicaciones);
app.use("/api/uploads", uploadRoutes);

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