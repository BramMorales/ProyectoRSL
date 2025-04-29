document.addEventListener('DOMContentLoaded', async () => {
  fetch
});

// Maneja el envío del formulario de registro
document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault(); // Evita el envío tradicional del formulario

  // Recolecta los datos del formulario
  const data = new FormData(e.target);
  const payload = {
    id: 0, // Se puede omitir si el backend lo autogenera
    nombre: data.get("nombre"),
    ciudad: data.get("ciudad"),
    especialidad: 1, // Posible futuro campo para seleccionar desde UI
    experticia: data.get("experticia"),
    direccion: data.get("direccion"),
    paginaweb: data.get("paginaweb"),
    telefono: data.get("telefono"),
    whatsapp: data.get("whatsapp"),
    bio: data.get("bio"),
    correo: data.get("correo"),
    usuario: data.get("usuario"),
    password: data.get("password"),
  };

  try {
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
