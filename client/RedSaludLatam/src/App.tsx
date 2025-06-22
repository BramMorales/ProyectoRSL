// App.tsx <Route path="*" element={<Navigate to="/" replace />} />
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import News from "./pages/News";
import RutaPublica from "./components/RutaProtegida";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/api/v1/Registro"
        element={
          <RutaPublica redirigirA="/">
            <Register />
          </RutaPublica>
        }
      />
      <Route path="/Noticias" element={<News />} />
    </Routes>
  );
}
