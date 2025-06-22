import * as React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  redirigirA?: string; // A dónde redirigir si ya está logueado (por defecto /noticias)
  soloInvitados?: boolean; // true si esta ruta es solo para usuarios NO autenticados
  rolPermitido?: string; // Si quieres restringir por rol
}

const RutaPublica = ({
  children,
  redirigirA = "/",
  soloInvitados = true,
  rolPermitido,
}: Props) => {
  const token = localStorage.getItem("jwt");
  const rol = localStorage.getItem("rol");

  // Si es solo para invitados, y ya hay sesión activa:
  if (soloInvitados && token) {
    // Si se especificó un rol y no coincide, no redirige aún
    if (rolPermitido && rol !== rolPermitido) return <>{children}</>;
    return <Navigate to={redirigirA} replace />;
  }

  return <>{children}</>;
};

export default RutaPublica;
