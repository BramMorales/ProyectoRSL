// src/pages/Home.tsx
import React, { useState, useEffect } from "react";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import SearchForm from "../components/SearchForm";
import WhatsAppFloat from "../components/WhatsAppFloat";
import Footer from "../components/Footer";
import NewsSection from "../components/NewSection";

const Home: React.FC = () => {
  const noticiasEjemplo = [
    {
      id: 1,
      title: "Nuevo convenio con clínica en México",
      summary:
        "Hemos firmado un acuerdo con la Clínica Salud+ en CDMX para ampliar nuestro directorio.",
      url: "/noticias/1",
    },
    {
      id: 2,
      title: "Alerta por horarios especiales de vacunación",
      summary:
        "Consulta los horarios de vacunación durante el fin de semana largo en Argentina.",
      url: "/noticias/2",
    },
    {
      id: 3,
      title: "Capacitación gratuita para médicos telemedicina",
      summary:
        "Inscríbete en nuestro webinar sobre herramientas de telemedicina este viernes.",
      url: "/noticias/3",
    },
  ];

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

  return (
    <>
      {/* Navegación superior */}
      <Nav />

      <Hero images={imagenes.map((img) => img.url)}>
        <h1>RedSaludLatam</h1>
        <SearchForm />
      </Hero>

      <NewsSection items={noticiasEjemplo} />

      {/* Botón flotante de WhatsApp */}
      <WhatsAppFloat />

      <Footer />
    </>
  );
};

export default Home;
