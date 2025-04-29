document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const busqueda = {
      que: urlParams.get('search_query'),
  };

  console.log("Consulta enviada:", busqueda);

  try {
      const res = await fetch("http://localhost:4000/api/usuarios/consulta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(busqueda),
      });

      if (!res.ok) {
          throw new Error(`Error en la petición: ${res.statusText}`);
      }

      const result = await res.json();
      const contenedor = document.getElementById("contenedorResultados");

      if (!contenedor) {
          console.error("No se encontró el contenedor de resultados");
          return;
      }

      if (!Array.isArray(result.body)) {
          console.error("La respuesta no contiene una lista válida");
          return;
      }
 
      result.body.forEach((usuario) => {
          const tarjeta = document.createElement("div");
          tarjeta.classList.add("tarjeta-doctor");

          tarjeta.innerHTML = `
              <div class="info">
                  <img src="${usuario.foto || '/img/default.png'}" alt="Foto del doctor">
                  <div class="texto">
                      <h3>${usuario.nombre}</h3>
                      <p><strong>Especialidad:</strong> ${usuario.especialidad}</p>
                      <p><strong>Dirección:</strong> ${usuario.direccion}</p>
                      <p><strong>Consultorio:</strong> ${usuario.consultorio || 'No disponible'}</p>
                      <p><strong>Precio:</strong> $${usuario.precio || 'No informado'}</p>
                  </div>
              </div>
              <button class="ver-perfil" data-id="${usuario.id}">Ver perfil</button>
          `;

          contenedor.appendChild(tarjeta);
      });

      // Delegar eventos para botones "Ver perfil"
      contenedor.addEventListener("click", (e) => {
          if (e.target.classList.contains("ver-perfil")) {
              const id = e.target.getAttribute("data-id");
              window.location.href = `/perfil/${id}`;
          }
      });

  } catch (err) {
      console.error("Error en la carga de resultados:", err.message);
  }
});
