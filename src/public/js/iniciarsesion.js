// Muestra el modal de inicio de sesión
function showLogin() {
  document.getElementById('loginModal').style.display = 'block';
}

// Oculta el modal de inicio de sesión
function hideLogin() {
  document.getElementById('loginModal').style.display = 'none';
}

// Cierra el modal si se hace clic fuera de él
window.onclick = function(event) {
  const modal = document.getElementById('loginModal');
  if (event.target === modal) {
    hideLogin();
  }
}

// Redirige al usuario a la página de registro
function Registro(event) {
  window.location.href = "/api/v1/Registro";
  return false; // Evita comportamiento por defecto del enlace o botón
}

// Maneja el envío del formulario de inicio de sesión
document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault(); // Previene el envío clásico del formulario
  
    // Obtiene los datos del formulario
    const data = new FormData(e.target);
    const payload = {
      usuario: data.get("logusuario"),
      password: data.get("logpassword"),
    };
  
    try {
      // Realiza la petición al servidor para autenticar al usuario
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      // Redirige a la vista principal si la solicitud fue exitosa
      // (Este comportamiento puede ajustarse según el status del servidor)
      if (res.ok) {
        window.location.href = "/Main";
      } else {
        const errorData = await res.json();
        alert(`Error de inicio de sesión: ${errorData.message || 'Credenciales incorrectas'}`);
      }
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      alert("Error al conectar con el servidor.");
    }
  });