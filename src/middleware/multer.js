const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Parsear el nombre de archivo para obtener el nombre de la carpeta
    const originalName = file.originalname;
    const match = originalName.match(/^carpeta__(.+?)__/);
    const folderName = match ? match[1] : "default";

    const uploadPath = path.join("uploads", folderName);
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const nombreFinal = req.body.nombre || "imagen-" + Date.now() + path.extname(file.originalname);
    cb(null, nombreFinal);
  }
});


const upload = multer({ storage });

module.exports = upload; // ✅ CommonJS
