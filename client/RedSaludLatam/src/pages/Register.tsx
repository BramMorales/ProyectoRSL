// src/pages/FormPage.tsx
import React from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const FormPage: React.FC = () => {
  return (
    <>
      <Nav />

      <main className="form-page">
        <aside className="side-image">
          <img src="/img/Hablando.jpg" alt="Doctor ilustrativo" />
        </aside>

        {/* Contenedor del formulario (3/4 del ancho) */}
        <div className="form-container">
          <h2 className="form-title">Registro de Nuevo Servicio Médico</h2>
          <form className="form-content">
            <div className="form-group">
              <label htmlFor="nombre">Nombre del Servicio:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Ej: Cardiología"
              />
            </div>
            <div className="form-group">
              <label htmlFor="descripcion">Descripción:</label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows={4}
                placeholder="Descripción breve del servicio..."
              />
            </div>
            <div className="form-group">
              <label htmlFor="direccion">Dirección:</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                placeholder="Calle 123, Ciudad"
              />
            </div>
            <div className="form-group">
              <label htmlFor="telefono">Teléfono de Contacto:</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                placeholder="+52 55 1234 5678"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="categoria">Categoría:</label>
              <select id="categoria" name="categoria">
                <option value="">Selecciona una categoría</option>
                <option value="cardiologia">Cardiología</option>
                <option value="pediatria">Pediatría</option>
                <option value="odontologia">Odontología</option>
                <option value="psicologia">Psicología</option>
              </select>
            </div>
            <button type="submit" className="form-submit-btn">
              Enviar Registro
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default FormPage;
