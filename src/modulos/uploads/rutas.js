const express = require("express");
const router = express.Router();
const upload = require("../../middleware/multer");
const path = require("path");
const fs = require("fs");


router.post("/Upload", upload.single("imagen"), (req, res) => {
  console.log(req.body.nombre);

  if (!req.file) {
    return res.status(400).json({ error: "No se recibió archivo" });
  }

  const ruta = req.file.path.replace(/\\/g, "/");
  res.status(200).json({ url: ruta });
});

router.get("/banners", (req, res) => {
  const carpeta = path.join(__dirname, "../../../uploads/banners");

  fs.readdir(carpeta, (err, archivos) => {
    if (err) {
      return res.status(500).json({ error: "No se pudieron listar las imágenes" });
    }

    const imagenes = archivos
      .filter((archivo) => /\.(jpg|jpeg|png|webp)$/i.test(archivo))
      .map((archivo) => `http://localhost:4000/uploads/banners/${archivo}`);

    res.json({ imagenes });
  });
});

router.delete("/banners", (req, res) => {
  const { nombre } = req.body; // espera el nombre del archivo

  if (!nombre) return res.status(400).json({ error: "Falta nombre del archivo" });

  const ruta = path.join(__dirname, "../../../uploads/banners", nombre);

  fs.unlink(ruta, (err) => {
    if (err) {
      console.error("Error al eliminar imagen:", err);
      return res.status(500).json({ error: "No se pudo eliminar la imagen" });
    }

    res.json({ mensaje: "Imagen eliminada correctamente" });
  });
});

module.exports = router;
