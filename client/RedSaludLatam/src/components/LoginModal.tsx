import "../styles/LoginModal.css";
import React, { useState } from "react";

interface Props {
  onClose: () => void;
}

const Modal: React.FC<Props> = ({ onClose }) => {
  const [usuario, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const datos = {
      usuario,
      password,
    };

    console.log(datos);

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(datos),
      });

      const result = await res.json();
      if (res.ok) {
        console.log("Login exitoso:", result);
        // Aquí puedes cerrar el modal o redirigir
        onClose();
        window.location.href = "/";
      } else {
        console.error("Error en login:", result.message || result);
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

        <h1>Iniciar Sesión</h1>
        <h5>¡Ingresa a tu perfil!</h5>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo electrónico</label>
            <input
              required
              value={usuario}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>
              <input type="checkbox" name="terms" /> Mantener sesion iniciada.
            </label>
          </div>

          <div className="form-group">
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>

          <div className="form-group">
            <button type="submit">Entrar</button>
          </div>

          <div className="form-group">
            <p>
              ¿No tienes una cuenta?
              <a href="/api/v1/Registro" onClick={onClose}>
                Regístrate aquí
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
