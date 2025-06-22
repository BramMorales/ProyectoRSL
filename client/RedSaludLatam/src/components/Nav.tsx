import { NavLink } from "react-router-dom";
import LoginModal from "./LoginModal";
import React, { useEffect, useState } from "react";
import { getUserFromServer, getNombreRsluser } from "../utils/auth"; // o el path que tengas

const Nav: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [nombre, setNombre] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNombre() {
      const usuario = await getUserFromServer();
      if (usuario && usuario.id_rsluser) {
        const nombreDoctor = await getNombreRsluser(usuario.id_rsluser);
        setNombre(nombreDoctor);
      }
    }

    fetchNombre();
  }, []);

  const tabs = [
    { to: "/", label: "Inicio" },
    { to: "/noticias", label: "Noticias" },
    { to: "/api/v1/Registro", label: "Registro" },
  ];

  const userTabs = [
    { to: "/", label: "Inicio" },
    { to: "/noticias", label: "Noticias" },
    { to: "/perfil", label: "Perfil" },
  ];

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:4000/api/auth/logout", {
        method: "POST",
        credentials: "include", // ← necesario para que se envíe la cookie
      });

      window.location.href = "/"; // redirige luego de cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <>
      <nav id="barra">
        <div className="nav-left">
          <NavLink to="/">
            <img src="/img/Logo.png" id="img" alt="Logo RedSaludLatam" />
          </NavLink>
        </div>
        <div className="nav-right">
          {nombre ? (
            <>
              <h4>Hola, {nombre}</h4>
              {userTabs.map(({ to, label }) => (
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
              <button onClick={handleLogout}>Cerrar sesión</button>
            </>
          ) : (
            <>
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

              {/* → A la función onClick le indico que ponga isModalOpen en true */}
              <button className="nav-link" onClick={() => setModalOpen(true)}>
                Iniciar Sesión
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ← Renderizo condicionalmente el modal: si isModalOpen es true, aparece */}
      {isModalOpen && <LoginModal onClose={() => setModalOpen(false)} />}
    </>
  );
};

export default Nav;
