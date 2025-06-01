// src/components/Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <p>© 2025 RedSaludLatam</p>
      <p>
        <a href="/terminos">Términos y Condiciones</a> |{" "}
        <a href="/privacidad">Política de Privacidad</a>
      </p>
      <p>Contacto: info@redsaludlatam.org</p>
    </footer>
  );
};

export default Footer;
