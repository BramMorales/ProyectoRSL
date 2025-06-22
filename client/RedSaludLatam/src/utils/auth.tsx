export interface JwtPayload {
  id_rsluser: number;
  usuario_rslauth: string;
  admin_rslauth: number;
}

export async function getUserFromServer(): Promise<JwtPayload | null> {
  try {
    const response = await fetch("http://localhost:4000/api/auth/me", {
      credentials: "include", // ← obligatorio para que se envíe la cookie
    });

    if (!response.ok) throw new Error("No autenticado");

    const data = await response.json();
    return {
      id_rsluser: data.id_rsluser,
      usuario_rslauth: data.usuario_rslauth,
      admin_rslauth: data.admin_rslauth,
    };
  } catch (err) {
    console.error("Error al obtener el usuario:", err);
    return null;
  }
}

export async function getNombreRsluser(
  id_rsluser: number
): Promise<string | null> {
  try {
    const response = await fetch(
      `http://localhost:4000/api/usuarios/${id_rsluser}`
    );

    if (!response.ok) throw new Error("No se encontró el usuario");

    const data = await response.json();
    return data.body.nombre_rsluser;
  } catch (err) {
    console.error("Error al obtener nombre del doctor:", err);
    return null;
  }
}
