// src/pages/Home.tsx
import React, { useState, useEffect } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Menu from "../components/SideMenu";
import Hero from "../components/Hero";
import SearchForm from "../components/SearchForm";

const HomeAdmin: React.FC = () => {
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [imagenes, setImagenes] = useState<{ url: string }[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/uploads/banners")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.imagenes)) {
          setImagenes(data.imagenes.map((url: string) => ({ url })));
        }
      })
      .catch((err) => {
        console.error("Error al cargar imágenes del banner:", err);
      });
  }, []);

  const eliminarImagen = async (index: number) => {
    const nombreArchivo = imagenes[index].url.split("/").pop(); // extrae solo el nombre

    try {
      const res = await fetch("http://localhost:4000/api/uploads/banners", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre: nombreArchivo }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al eliminar imagen");

      // si todo sale bien, actualizamos estado
      setImagenes(imagenes.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Error al eliminar imagen:", err);
      alert("No se pudo eliminar la imagen.");
    }
  };

  const handleNuevaImagen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("imagen", file, `carpeta__banners__${file.name}`);

    try {
      const res = await fetch("http://localhost:4000/api/uploads/Upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error subiendo imagen");

      // Agregar imagen a las visibles
      setImagenes((prev) => [...prev, { url: "/" + data.url }]);
    } catch (err) {
      console.error("Fallo al subir imagen:", err);
      alert("No se pudo subir la imagen.");
    }
  };

  return (
    <div
      className="app-container"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Nav />
      <div className="main-wrapper" style={{ flex: 1, position: "relative" }}>
        <Menu />

        <Hero images={imagenes.map((img) => img.url)}>
          <h1>RedSaludLatam</h1>
          <SearchForm />
        </Hero>

        {/* Botón flotante para abrir/cerrar el panel */}
        <div className="carousel-sidebar-toggle">
          <button
            onClick={() => setPanelAbierto(!panelAbierto)}
            style={{
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              padding: "10px 15px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            📷 Carrusel
          </button>
        </div>

        {/* Panel lateral de gestión de imágenes */}
        {panelAbierto && (
          <aside
            style={{
              position: "fixed",
              bottom: "70px",
              right: "20px",
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              width: "260px",
              maxHeight: "60vh",
              overflowY: "auto",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              zIndex: 999,
            }}
          >
            <h4>Imágenes del carrusel</h4>
            {imagenes.map((img, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <img
                  src={img.url}
                  alt={`Imagen ${index + 1}`}
                  style={{
                    width: "60px",
                    height: "40px",
                    objectFit: "cover",
                    marginRight: "10px",
                  }}
                />
                <button
                  onClick={() => eliminarImagen(index)}
                  style={{
                    backgroundColor: "#ff5c5c",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "5px 8px",
                    cursor: "pointer",
                  }}
                >
                  ❌
                </button>
              </div>
            ))}
            <input type="file" accept="image/*" onChange={handleNuevaImagen} />
          </aside>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default HomeAdmin;
