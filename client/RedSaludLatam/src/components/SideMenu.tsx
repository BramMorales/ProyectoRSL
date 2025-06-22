// Sidebar.tsx
import React, { useState, useEffect } from "react";
import LoginModal from "./SpecialityModal";
import "../styles/SideMenu.css";

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
  type Especialidad = {
    id_rslespecialidad: number;
    especialidad_rslespecialidad: string;
  };

  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/api/especialidades")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.body)) {
          setEspecialidades(data.body);
        } else {
          console.error("La respuesta no contiene un array válido:", data);
          setEspecialidades([]);
        }
      })
      .catch((error) => {
        console.error("Error al cargar especialidades:", error);
      });
  }, []);

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [expandedSpecialty, setExpandedSpecialty] = useState<string | null>(
    null
  );

  const toggleMenu = (menu: string) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
    if (openMenu !== menu) setExpandedSpecialty(null);
  };
  const toggleSpecialty = (spec: string) => {
    setExpandedSpecialty((prev) => (prev === spec ? null : spec));
  };

  return (
    <>
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <ul>
            {/* --- 1) USUARIOS --- */}
            <li>
              <button
                className={`sidebar-button ${
                  openMenu === "usuarios" ? "active" : ""
                }`}
                onClick={() => toggleMenu("usuarios")}
              >
                <i className="fa fa-users icon" aria-hidden="true" />
                <span>Usuarios</span>
                <i
                  className={`fa ${
                    openMenu === "usuarios"
                      ? "fa-chevron-down"
                      : "fa-chevron-right"
                  } toggle-icon`}
                  aria-hidden="true"
                />
              </button>
              {openMenu === "usuarios" && (
                <ul className="submenu">
                  {especialidades.map((spec) => (
                    <li key={spec.id_rslespecialidad}>
                      <button
                        className={`sidebar-button subitem ${
                          expandedSpecialty ===
                          spec.id_rslespecialidad.toString()
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          toggleSpecialty(spec.id_rslespecialidad.toString())
                        }
                      >
                        <i
                          className="fa fa-stethoscope icon"
                          aria-hidden="true"
                        />
                        <span>{spec.especialidad_rslespecialidad}</span>
                        <i
                          className={`fa ${
                            expandedSpecialty ===
                            spec.id_rslespecialidad.toString()
                              ? "fa-chevron-down"
                              : "fa-chevron-right"
                          } toggle-icon`}
                          aria-hidden="true"
                        />
                      </button>

                      {expandedSpecialty ===
                        spec.id_rslespecialidad.toString() && (
                        <ul className="submenu sub-submenu">
                          <li>
                            <button className="sidebar-button subsubitem">
                              <i
                                className="fa fa-check-circle icon"
                                aria-hidden="true"
                              />
                              <span>Verificados</span>
                            </button>
                          </li>
                          <li>
                            <button className="sidebar-button subsubitem">
                              <i
                                className="fa fa-clock-o icon"
                                aria-hidden="true"
                              />
                              <span>Pendientes</span>
                            </button>
                          </li>
                        </ul>
                      )}
                    </li>
                  ))}

                  <li>
                    <button
                      className="sidebar-button subitem create-btn"
                      onClick={() => setModalOpen(true)}
                    >
                      <i
                        className="fa fa-plus-circle icon"
                        aria-hidden="true"
                      />
                      <span>Crear</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* --- 2) PUBLICACIONES --- */}
            <li>
              <button
                className={`sidebar-button ${
                  openMenu === "publicaciones" ? "active" : ""
                }`}
                onClick={() => toggleMenu("publicaciones")}
              >
                <i className="fa fa-newspaper-o icon" aria-hidden="true" />
                <span>Publicaciones</span>
                <i
                  className={`fa ${
                    openMenu === "publicaciones"
                      ? "fa-chevron-down"
                      : "fa-chevron-right"
                  } toggle-icon`}
                  aria-hidden="true"
                />
              </button>
              {openMenu === "publicaciones" && (
                <ul className="submenu">
                  <li>
                    <button className="sidebar-button subitem">
                      <i className="fa fa-clock-o icon" aria-hidden="true" />
                      <span>Pendientes</span>
                    </button>
                  </li>
                  <li>
                    <button className="sidebar-button subitem">
                      <i
                        className="fa fa-check-circle icon"
                        aria-hidden="true"
                      />
                      <span>Verificados</span>
                    </button>
                  </li>

                  <li>
                    <button className="sidebar-button subitem create-btn">
                      <i
                        className="fa fa-plus-circle icon"
                        aria-hidden="true"
                      />
                      <span>Crear</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* --- 3) PUBLICIDAD --- */}
            <li>
              <button
                className={`sidebar-button ${
                  openMenu === "publicidad" ? "active" : ""
                }`}
                onClick={() => toggleMenu("publicidad")}
              >
                <i className="fa fa-bullhorn icon" aria-hidden="true" />
                <span>Publicidad</span>
                <i aria-hidden="true" />
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {isModalOpen && <LoginModal onClose={() => setModalOpen(false)} />}
    </>
  );
};

export default Sidebar;
