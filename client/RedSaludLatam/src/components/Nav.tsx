import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import LoginModal from "./LoginModal"; // Lo crearemos en el siguiente paso

const Nav: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const tabs = [
    { to: "/", label: "Inicio" },
    { to: "/noticias", label: "Noticias" },
    { to: "/api/v1/Registro", label: "Registro" },
  ];

  return (
    <>
      <nav id="barra">
        <div className="nav-left">
          <NavLink to="/">
            <img src="/img/Logo.png" id="img" alt="Logo RedSaludLatam" />
          </NavLink>
        </div>

        <div className="nav-right">
          {tabs.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {label}
            </NavLink>
          ))}

          {/* Iniciar Sesión con modal */}
          <button className="nav-link" onClick={() => setModalOpen(true)}>
            Iniciar Sesión
          </button>
        </div>
      </nav>

      {/* Modal visible si isModalOpen es true */}
      {isModalOpen && <LoginModal onClose={() => setModalOpen(false)} />}
    </>
  );
};

export default Nav;
