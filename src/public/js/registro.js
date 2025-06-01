document.addEventListener('DOMContentLoaded', async () => {
  fetch
});

function previewImage(event, idPreview) {
    const input = event.target;
    const preview = document.getElementById(idPreview);

    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.display = "block";
      };

      reader.readAsDataURL(input.files[0]);
    }
  }

// Maneja el envío del formulario de registro
document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault(); // Evita el envío tradicional del formulario

  const img = document.getElementById("previewLogo");
const url = img.src;
var blob;

// 1.1) Si es un Data-URL (data:image/...;base64,...), conviértelo primero a un Blob:
// opcionalmente puedes distinguir usando url.startsWith("data:")
if (url.startsWith("data:")) {
  // Extrae la parte base64
  const [meta, base64] = url.split(",");
  const mime = meta.match(/data:(.*);base64/)[1];
  // decodifica
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  blob = new Blob([bytes], { type: mime });
  // → ya tienes tu Blob
}

// 1.2) Si es una URL normal (http:// o /uploads/…), úsala con fetch:
fetch(url)
  .then(res => res.blob())
  .then(blob => {
    // → aquí tienes tu Blob
    console.log(blob);
  })
  .catch(console.error);


  // Recolecta los datos del formulario
  const data = new FormData(e.target);
  const payload = {
    id: 0, // Se puede omitir si el backend lo autogenera
    nombre: data.get("nombre"),
    ciudad: data.get("ciudad"),
    estado: data.get("estado"),
    especialidad: 1, // Posible futuro campo para seleccionar desde UI
    experticia: data.get("experticia"),
    direccion: data.get("direccion"),
    paginaweb: data.get("paginaweb"),
    telefono: data.get("telefono"),
    whatsapp: data.get("whatsapp"),
    bio: data.get("bio"),
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",
    twitter: "",
    logo: blob,
    perfil: data.get("fotoPerfil"),
    correo: data.get("correo"),
    usuario: data.get("usuario"),
    password: data.get("password"),
  };

  console.log(blob)
  try {
    const redesAgregadas = document.querySelectorAll(".registro-red");

    redesAgregadas.forEach(div => {
      const tipo = div.dataset.red;
      const texto = div.querySelector("label").textContent.split(":")[1].trim();

      switch (tipo) {
        case "fb":
          payload.facebook = texto;
          break;
        case "ig":
          payload.instagram = texto;
          break;
        case "li":
          payload.linkedin = texto;
          break;
        case "x":
          payload.twitter = texto;
          break;

        case "yt":
          payload.youtube = texto;
          break;
      }
    });

    // Realiza la petición para registrar al nuevo usuario
    const res = await fetch("http://localhost:4000/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    // Manejo de errores personalizados
    if (!res.ok) {
      switch (result.code) {
        case 'USER_TAKEN':
          alert('Ese nombre de usuario ya existe.');
          break;
        case 'EMAIL_TAKEN':
          alert('Ese correo ya está registrado.');
          break;
        case 'SERVER_ERROR':
          alert('Hubo un problema en el servidor. Intenta más tarde.');
          break;
        default:
          alert('Error desconocido: ' + result.message);
      }
      return;
    }

    // Registro exitoso
    alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
    window.location.href = "/Inicio"; // Redirige a la página principal o login

  } catch (error) {
    console.error("Error en el registro:", error);
    alert("No se pudo conectar con el servidor.");
  }
});

document.getElementById("agregar").addEventListener("click", async (e) => {
  const contenedor = document.getElementById("contenedorResultados");
  const select = document.getElementById("red");
  const text = document.getElementById("redesocial").value.trim();
  const textoSeleccionado = select.options[select.selectedIndex].text;
  const valorSeleccionado = select.value;

  // Verificar si ya se agregó esa red social
  const yaExiste = Array.from(contenedor.querySelectorAll(".registro-red")).some(div => 
    div.dataset.red === valorSeleccionado
  );

  if (yaExiste) {
    alert(`Ya has agregado un enlace para ${textoSeleccionado}.`);
    document.getElementById("redesocial").value = "";
    return;
  }

  //GuardarVariable
  
  // Crear contenedor
  const renglon = document.createElement("div");
  renglon.classList.add("registro-red");
  renglon.dataset.red = valorSeleccionado;
  renglon.style.display = "flex";
  renglon.style.alignItems = "center";
  renglon.style.gap = "10px";
  renglon.style.marginBottom = "5px";

  const etiqueta = document.createElement("label");
  etiqueta.textContent = `${textoSeleccionado}: ${text}`;

  const btnEliminar = document.createElement("button");
  btnEliminar.textContent = "Eliminar";
  btnEliminar.type = "button";
  btnEliminar.style.backgroundColor = "#ff5c5c";
  btnEliminar.style.border = "none";
  btnEliminar.style.color = "white";
  btnEliminar.style.padding = "5px 10px";
  btnEliminar.style.cursor = "pointer";
  btnEliminar.style.borderRadius = "4px";

  btnEliminar.addEventListener("click", () => {
    contenedor.removeChild(renglon);
  });

  renglon.appendChild(etiqueta);
  renglon.appendChild(btnEliminar);
  contenedor.appendChild(renglon);

  document.getElementById("redesocial").value = "";
});
