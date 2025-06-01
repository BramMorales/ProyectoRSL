// src/components/WhatsAppFloat.tsx
import React from "react";

const WhatsAppFloat: React.FC = () => {
  return (
    <a
      href="https://wa.me/123456789"
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
    >
      {/* Aquí podrías usar un ícono de WhatsApp, o bien una “W” si quieres algo rápido */}
      <span style={{ fontSize: "30px", color: "#fff" }}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/2062095_application_chat_communication_logo_whatsapp_icon.svg/2048px-2062095_application_chat_communication_logo_whatsapp_icon.svg.png"
          height={70}
          width={70}
        />
      </span>
    </a>
  );
};

export default WhatsAppFloat;
