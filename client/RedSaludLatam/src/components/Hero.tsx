// src/components/Hero.tsx
import React, { useState, useEffect } from "react";

interface HeroProps {
  /** Arreglo de URLs (o paths en public/) de las imágenes */
  images: string[];
  /** Intervalo (en ms) para cambiar de slide; por defecto 5 segundos */
  interval?: number;
  /** Contenido que quieras centrar encima del banner */
  children?: React.ReactNode;
}

const Hero: React.FC<HeroProps> = ({ images, interval = 5000, children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;

    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(id);
  }, [images, interval]);

  return (
    <section className="hero">
      {/*
        Generamos un div.hero-slide por cada imagen en el arreglo.
        Solo el índice que coincide con currentIndex tendrá la clase “active”,
        lo que hace que su opacity pase a 1 (visible), y el resto tengan opacity 0.
      */}
      {images.map((url, idx) => (
        <div
          key={idx}
          className={`hero-slide ${idx === currentIndex ? "active" : ""}`}
          style={{ backgroundImage: `url(${url})` }}
        />
      ))}

      {/*
        Overlay semitransparente (negro al 40%)
        que atenúa el slide actual.
      */}
      <div className="hero-overlay" />

      {/*
        Contenido centrado (texto, botones, etc.) que aparece encima.
      */}
      <div className="hero-content">{children}</div>
    </section>
  );
};

export default Hero;
