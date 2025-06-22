import React, { useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

import "../styles/Noticias.css";

const Noticias = () => {
  const noticiasMock = [
    { id: 1, titulo: "Noticia 1", resumen: "Resumen 1", imagen: "imagen1.jpg" },
    { id: 2, titulo: "Noticia 2", resumen: "Resumen 2", imagen: "imagen2.jpg" },
  ];

  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 9;

  const totalPaginas = Math.ceil(noticiasMock.length / porPagina);
  const noticiasPagina = noticiasMock.slice(
    (paginaActual - 1) * porPagina,
    paginaActual * porPagina
  );

  const cambiarPagina = (nueva: number) => {
    if (nueva >= 1 && nueva <= totalPaginas) {
      setPaginaActual(nueva);
    }
  };

  return (
    <>
      <Nav />

      {/* Contenedor izquierdo para publicidad */}
      <aside className="ad-container ad-left">
        <div className="ad-content">
          <h3 className="ad-title">Publicidad</h3>
          <p className="ad-text">
            Espacio disponible para banner o enlace de patrocinador.
          </p>
        </div>
      </aside>

      <div className="noticias-container">
        <h2 className="noticias-titulo">Noticias</h2>

        <div className="noticias-grid">
          {noticiasPagina.map((noticia) => (
            <div className="noticia-card" key={noticia.id}>
              <img src={noticia.imagen} alt="" className="noticia-img" />
              <div className="noticia-content">
                <h3 className="noticia-titulo">{noticia.titulo}</h3>
                <p className="noticia-resumen">{noticia.resumen}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contenedor derecho para publicidad */}
        <aside className="ad-container ad-right">
          <div className="ad-content">
            <h3 className="ad-title">Publicidad</h3>
            <p className="ad-text">
              Otro espacio para banner o enlace de patrocinador.
            </p>
          </div>
        </aside>

        {/* Paginación optimizada */}
        <div className="paginacion">
          <button
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
          >
            Anterior
          </button>

          {paginaActual > 3 && (
            <React.Fragment>
              <button onClick={() => cambiarPagina(1)}>1</button>
              {paginaActual > 4 && <span>...</span>}
            </React.Fragment>
          )}

          {Array.from({ length: totalPaginas }, (_, i) => i + 1)
            .filter((num) => Math.abs(paginaActual - num) <= 2)
            .map((num) => (
              <button
                key={num}
                onClick={() => cambiarPagina(num)}
                className={paginaActual === num ? "activo" : ""}
              >
                {num}
              </button>
            ))}

          {paginaActual < totalPaginas - 2 && (
            <React.Fragment>
              {paginaActual < totalPaginas - 3 && <span>...</span>}
              <button onClick={() => cambiarPagina(totalPaginas)}>
                {totalPaginas}
              </button>
            </React.Fragment>
          )}

          <button
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
          >
            Siguiente
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Noticias;
