import React, { useState, useEffect } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

function getExtension(filename: string) {
  return filename.slice(filename.lastIndexOf("."));
}

interface Especialidad {
  id_rslespecialidad: number;
  especialidad_rslespecialidad: string;
}

interface RedSocial {
  nombre: string;
  valor: string;
  enlace: string;
}

const opcionesRedes = [
  { valor: "instagram_rsluser", nombre: "Instagram" },
  { valor: "youtube_rsluser", nombre: "Youtube" },
  { valor: "linkedin_rsluser", nombre: "LinkedIn" },
  { valor: "facebook_rsluser", nombre: "Facebook" },
  { valor: "twitter_rsluser", nombre: "Twitter" },
];

const FormPage: React.FC = () => {
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [enlace, setEnlace] = useState("");
  const [redSeleccionada, setRedSeleccionada] = useState("instagram_rsluser");
  const [redesAgregadas, setRedesAgregadas] = useState<RedSocial[]>([]);

  const getNombreRed = (valor: string) => {
    return opcionesRedes.find((op) => op.valor === valor)?.nombre || valor;
  };

  const eliminarRed = (valor: string) => {
    setRedesAgregadas(redesAgregadas.filter((red) => red.valor !== valor));
  };

  const handleAgregar = () => {
    if (!enlace.trim()) return;
    const yaExiste = redesAgregadas.some(
      (red) => red.valor === redSeleccionada
    );
    if (yaExiste) {
      alert(`Ya has agregado un enlace para ${getNombreRed(redSeleccionada)}.`);
      setEnlace("");
      return;
    }
    setRedesAgregadas([
      ...redesAgregadas,
      { valor: redSeleccionada, nombre: getNombreRed(redSeleccionada), enlace },
    ]);
    setEnlace("");
  };

  useEffect(() => {
    fetch("http://localhost:4000/api/especialidades")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.body)) setEspecialidades(data.body);
        else console.error("Respuesta inesperada:", data);
      })
      .catch((err) => console.error("Error cargando especialidades:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const redesPlanas = redesAgregadas.reduce((acc, red) => {
      acc[red.valor] = red.enlace;
      return acc;
    }, {} as Record<string, string>);

    const payload = {
      nombre_rsluser: formData.get("nombre"),
      ciudad_rsluser: formData.get("ciudad"),
      estado_rsluser: formData.get("estado"),
      direccion_rsluser: formData.get("direccion"),
      especialidad_rsluser: Number(formData.get("especialidad")),
      experticia_rsluser: formData.get("experticia"),
      bio_rsluser: formData.get("bio"),
      paginaweb_rsluser: formData.get("paginaweb"),
      telefono_rsluser: formData.get("telefono"),
      whatsapp_rsluser: formData.get("whatsapp"),
      ...redesPlanas,
      verificado_rsluser: 0,
      correo_rslauth: formData.get("correo"),
      usuario_rslauth: formData.get("usuario"),
      password_rslauth: formData.get("password"),
      admin_rslauth: 0,
    };

    let idUsuario = 0;
    try {
      const res = await fetch("http://localhost:4000/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      idUsuario = json.body.id;
    } catch (err) {
      console.error("Error registrando usuario:", err);
      alert("Registro fallido.");
      return;
    }

    const subirImagen = async (file: File, tipo: string) => {
      const data = new FormData();
      data.append("nombre", `${tipo}_${Date.now()}${getExtension(file.name)}`);
      data.append("imagen", file, `carpeta__${idUsuario}__${file.name}`);

      const res = await fetch("http://localhost:4000/api/uploads/Upload", {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(`Error subiendo ${tipo}`);
      return json.url;
    };

    let perfilUrl = "";
    let logoUrl = "";
    try {
      const fotoPerfil = formData.get("fotoPerfil") as File;
      if (fotoPerfil && fotoPerfil.name)
        perfilUrl = await subirImagen(fotoPerfil, "perfil");

      const logo = formData.get("logo") as File;
      if (logo && logo.name) logoUrl = await subirImagen(logo, "logo");
    } catch (err) {
      console.error("Error subiendo imágenes:", err);
    }

    try {
      const res = await fetch("http://localhost:4000/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_rsluser: idUsuario,
          nombre_rsluser: payload.nombre_rsluser,
          ciudad_rsluser: payload.ciudad_rsluser,
          especialidad_rsluser: payload.especialidad_rsluser,
          experticia_rsluser: payload.experticia_rsluser,
          direccion_rsluser: payload.direccion_rsluser,
          whatsapp_rsluser: payload.whatsapp_rsluser,
          bio_rsluser: payload.bio_rsluser,
          estado_rsluser: payload.estado_rsluser,
          verificado_rsluser: payload.verificado_rsluser,
          logourl_rsluser: logoUrl,
          perfilurl_rsluser: perfilUrl,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      alert("¡Usuario registrado!\nVerifica tu correo");
      window.location.href = "/";
    } catch (err) {
      console.error("Error al actualizar con imágenes:", err);
      alert("Registro incompleto (imágenes fallaron).");
    }
  };

  return (
    <>
      <Nav />

      <main className="form-page">
        <aside className="side-image">
          <img src="/img/Hablando.jpg" alt="Doctor ilustrativo" />
        </aside>

        {/* Contenedor del formulario (3/4 del ancho) */}
        <div className="form-container">
          <h1>¡Crea tu perfil!</h1>
          <form className="form-content" onSubmit={handleSubmit}>
            <section>
              <p>
                ¿Usuario registrado? <a href="/">Inicia sesión</a>. Si eres un{" "}
                <strong>nuevo usuario</strong>, continúa registrándote en este
                formulario.
              </p>

              <h2 className="form-title">Información esencial</h2>
              <div className="form-group">
                <label htmlFor="nombre">Nombre De Presentación</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Ej: Dr. Juan Pérez"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="ciudad">Ciudad</label>
                <input
                  type="text"
                  id="ciudad"
                  name="ciudad"
                  placeholder="Ej: Ciudad de México"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="estado">Estado</label>
                <input
                  type="text"
                  id="estado"
                  name="estado"
                  placeholder="Ej: Baja California"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="direccion">Dirección Completa</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  placeholder="Calle, número, colonia"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="especialidad">Área de Especialidad</label>
                <select id="especialidad" name="especialidad" required>
                  <option value="">Seleccione una especialidad</option>
                  {especialidades.map((esp) => (
                    <option
                      key={esp.id_rslespecialidad}
                      value={esp.id_rslespecialidad}
                    >
                      {esp.especialidad_rslespecialidad}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="experticia">Experticia En</label>
                <input
                  type="text"
                  id="experticia"
                  name="experticia"
                  placeholder="Ej: Cirugía laparoscópica"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="fotoPerfil">Foto de perfil:</label>
                <input
                  type="file"
                  id="fotoPerfil"
                  name="fotoPerfil"
                  accept="image/*"
                />
                <img
                  id="previewPerfil"
                  className="preview"
                  src="#"
                  alt="Vista previa"
                  style={{ display: "none" }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="logo">Logo:</label>
                <input type="file" id="logo" name="logo" accept="image/*" />
                <img
                  id="previewLogo"
                  className="preview"
                  src="#"
                  alt="Vista previa"
                  style={{ display: "none" }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio">Descripción</label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  placeholder="Describe tus servicios y experiencia"
                  required
                ></textarea>
              </div>
            </section>

            <section>
              <h2 className="form-title">Redes sociales</h2>

              <div className="form-group">
                <label htmlFor="paginaweb">Página Web</label>
                <input
                  type="url"
                  id="paginaweb"
                  name="paginaweb"
                  placeholder="https://www.tusitio.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefono">Teléfono</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  placeholder="5512345678"
                  pattern="[0-9]{10}"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="whatsapp">WhatsApp</label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  placeholder="5512345678"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="red">Red social:</label>
                <select
                  id="red"
                  name="red"
                  value={redSeleccionada}
                  onChange={(e) => setRedSeleccionada(e.target.value)}
                  required
                >
                  {opcionesRedes.map((op) => (
                    <option key={op.valor} value={op.valor}>
                      {op.nombre}
                    </option>
                  ))}
                </select>

                <label htmlFor="redesocial">Enlace a red social:</label>
                <input
                  type="url"
                  id="redesocial"
                  name="redesocial"
                  placeholder="https://..."
                  value={enlace}
                  onChange={(e) => setEnlace(e.target.value)}
                />

                <button type="button" onClick={handleAgregar}>
                  Agregar
                </button>

                <div id="contenedorResultados" style={{ marginTop: "1rem" }}>
                  {redesAgregadas.map((red) => (
                    <div
                      key={red.valor}
                      className="registro-red"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "5px",
                      }}
                    >
                      <label>
                        {red.nombre}: {red.enlace}
                      </label>
                      <button
                        type="button"
                        onClick={() => eliminarRed(red.valor)}
                        style={{
                          backgroundColor: "#ff5c5c",
                          color: "white",
                          padding: "5px 10px",
                          borderRadius: "4px",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <div className="form-group">
                <h2 className="form-title">Términos y condiciones</h2>
                <div className="terms-box">
                  <p>
                    1. Objeto de la Plataforma. Esta plataforma (en adelante,
                    “RedSaludLatam”) tiene como finalidad facilitar el contacto
                    y la comunicación entre profesionales de la salud y
                    potenciales pacientes o colaboradores, sirviendo únicamente
                    como un directorio informativo. No constituye un medio
                    publicitario, comercial o de índole clínica. Toda la
                    información publicada en RedSaludLatam es proporcionada
                    voluntariamente por los usuarios registrados, sin que exista
                    verificación o aval médico-directo por parte de los
                    administradores de la plataforma.
                  </p>
                  <p>
                    2. Responsabilidad sobre la Información. Los usuarios
                    (profesionales de la salud) garantizan la veracidad,
                    exactitud y actualización de los datos que ingresan
                    (incluyendo, pero no limitado a, nombre profesional,
                    especialidad, dirección, número de contacto, enlaces a redes
                    sociales y cualquier recurso gráfico o audiovisual).
                    RedSaludLatam no se hace responsable de las omisiones,
                    errores, inexactitudes o desactualización de dicha
                    información. Cualquier daño o perjuicio que pudiera
                    derivarse de la consulta o uso de los datos aquí publicados
                    será asumido en exclusiva por el usuario responsable de la
                    publicación.
                  </p>
                  <p>
                    3. Enlaces a Terceros. La plataforma puede contener enlaces
                    o referencias a sitios web externos que ofrecen servicios o
                    información sobre salud. Estos enlaces se proporcionan
                    únicamente como un recurso adicional; RedSaludLatam no se
                    responsabiliza del contenido, políticas de privacidad,
                    prácticas comerciales o calidad de los servicios ofrecidos
                    en dichos sitios externos. Cualquier interacción,
                    transacción o relación contractual establecida con terceros
                    a través de esos enlaces es responsabilidad directa del
                    usuario.
                  </p>
                  <p>
                    4. Limitación de Responsabilidad. RedSaludLatam y sus
                    administradores quedarán exentos de toda responsabilidad en
                    caso de: a) Daños o perjuicios directos, indirectos,
                    incidentales, especiales o consecuentes derivados del uso o
                    imposibilidad de uso de la plataforma. b) Cualquier acción u
                    omisión de los usuarios que resulte en difamación, fraude,
                    negligencia o mala praxis. c) La interrupción, suspensión o
                    cese del servicio por causas ajenas a la voluntad de
                    RedSaludLatam (fallos técnicos, mantenimiento, ataques
                    informáticos, problemas en el proveedor de hosting, etc.).
                  </p>
                  <p>
                    5. Protección de Datos Personales. RedSaludLatam se
                    compromete a resguardar la privacidad de los datos
                    personales de los usuarios, de acuerdo con la legislación
                    vigente en materia de protección de datos. Los datos
                    recabados se emplearán exclusivamente para los fines propios
                    de la plataforma (p. ej., exhibir información de contacto de
                    profesionales). El usuario puede ejercer sus derechos de
                    acceso, rectificación, cancelación y oposición (ARCO)
                    escribiendo a
                    [privacidad@redsaludlatam.org](mailto:privacidad@redsaludlatam.org).
                  </p>
                  <p>
                    6. Obligaciones del Usuario. a) Publicar información
                    verídica, completa y actualizada. b) No incluir contenido
                    ofensivo, discriminatorio, ilícito o que infrinja derechos
                    de terceros. c) Cumplir con las normativas profesionales y
                    éticas propias de su ejercicio médico—sea reguladas por
                    colegios médicos, asociaciones profesionales o entidades
                    gubernamentales—en caso de ofrecer u ofrecer servicios
                    vinculados a la salud.
                  </p>
                  <p>
                    7. Propiedad Intelectual. Todo el contenido de RedSaludLatam
                    (textos, logotipos, imágenes, diseño, código fuente, etc.)
                    está protegido por la legislación sobre propiedad
                    intelectual e industrial. Queda prohibida su reproducción,
                    distribución, comunicación pública o transformación sin la
                    autorización expresa por escrito de los titulares de los
                    derechos.
                  </p>
                  <p>
                    8. Modificaciones y Duración. RedSaludLatam se reserva el
                    derecho de modificar, en cualquier momento y sin previo
                    aviso, la presentación, configuración y contenidos de la
                    plataforma, así como de actualizar estos Términos y
                    Condiciones. Cualquier cambio será notificado en la propia
                    página web; el uso continuado de la plataforma implicará la
                    aceptación tácita de dichas modificaciones.
                  </p>
                  <p>
                    9. Legislación y Jurisdicción Aplicable. Estos Términos y
                    Condiciones se rigen por las leyes mexicanas vigentes en el
                    Estado de Baja California. Para la interpretación,
                    cumplimiento y ejecución de los presentes términos, las
                    partes se someten a los tribunales competentes con
                    residencia en Tijuana, Baja California, renunciando
                    expresamente a cualquier otro fuero que pudiera
                    corresponderles por razón de su domicilio presente o futuro.
                  </p>
                </div>
                <label>
                  <input type="checkbox" name="terms" required /> Acepto los
                  términos y condiciones.
                </label>
              </div>
            </section>

            <section>
              <h2 className="form-title">Datos de acceso</h2>

              <div className="form-group">
                <label htmlFor="correo">Correo Electrónico</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  placeholder="tucorreo@ejemplo.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="usuario">Nombre de Usuario</label>
                <input
                  type="text"
                  id="usuario"
                  name="usuario"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Mínimo 8 caracteres"
                  minLength={8}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmar">Confirmar contraseña</label>
                <input
                  type="password"
                  id="confirmar"
                  name="confirmar"
                  placeholder="Mínimo 8 caracteres"
                  minLength={8}
                  required
                />
              </div>
            </section>

            <button type="submit">Guardar</button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default FormPage;
