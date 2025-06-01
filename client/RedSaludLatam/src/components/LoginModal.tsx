import React from "react";
import "../styles/LoginModal.css";

interface Props {
  onClose: () => void;
}

const LoginModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h2>Iniciar Sesión</h2>
        <form>
          <label>Correo electrónico</label>
          <input type="email" required />

          <label>Contraseña</label>
          <input type="password" required />

          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
