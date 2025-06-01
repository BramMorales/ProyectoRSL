document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const busqueda = {
      que: urlParams.get('search_query'),
  };

  try {
    const response = await fetch("http://localhost:4000/api/usuarios/consulta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(busqueda),
      });
      if (!response.ok) throw new Error(response.statusText);
  
      // 2) Extrae el JSON
      const { body: usuarios } = await response.json();
  
      // 3) Selecciona el contenedor
      const contenedor = document.getElementById("contenedorResultados");
      contenedor.innerHTML = ""; // limpia resultados anteriores

      // 4) Por cada usuario, monta la tarjeta usando el logo ya en Data-URL
      usuarios.forEach(usuario => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta-doctor");
  
        console.log(usuario.logo)

        tarjeta.innerHTML = `
          <div class="info">
            <img 
              src="${usuario.logo}" 
              alt="Foto de ${usuario.nombre}" 
              width="100" 
              height="100"
            >
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
  
      // 5) Evento delegado para “Ver perfil”
      contenedor.addEventListener("click", e => {
        if (e.target.classList.contains("ver-perfil")) {
          window.location.href = `/perfil/${e.target.dataset.id}`;
        }
      });
  } catch (err) {
      console.error("Error en la carga de resultados:", err.message);
  }
});
