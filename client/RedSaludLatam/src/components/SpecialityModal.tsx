import "../styles/LoginModal.css";
import React, { useState } from "react";

interface Props {
  onClose: () => void;
}

const Modal: React.FC<Props> = ({ onClose }) => {
  const [especialidad_rslespecialidad, setEspecialidad] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const datos = {
      especialidad_rslespecialidad,
    };

    try {
      const res = await fetch(
        "http://localhost:4000/api/especialidades/agregar/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(datos),
        }
      );

      const result = await res.json();
      if (res.ok) {
        console.log("Especialidad agregada:", result);
        onClose();
        window.location.reload();
      } else {
        console.error("Error en registro:", result.message || result);
      }
    } catch (err) {
      console.error("Error en la petición:", err);
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-content bg-white">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <h1>Registrar especialidad</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre especialidad:</label>
            <input
              required
              value={especialidad_rslespecialidad}
              onChange={(e) => setEspecialidad(e.target.value)}
            />
          </div>

          <div className="form-group">
            <button type="submit">Agregar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
