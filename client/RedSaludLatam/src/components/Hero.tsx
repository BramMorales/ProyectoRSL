// src/components/Hero.tsx
import React from "react";

interface HeroProps {
  children?: React.ReactNode;
}

const Hero: React.FC<HeroProps> = ({ children }) => {
  return (
    <section className="hero">
      <div className="hero-overlay" />
      <div className="hero-content">{children}</div>
    </section>
  );
};

export default Hero;
