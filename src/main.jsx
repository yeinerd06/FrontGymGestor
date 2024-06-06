import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../node_modules/@fortawesome/fontawesome-free/css/all.min.css";

import "./index.css";
import AuthLayout from "./layouts/Auth";
import UsuarioLayout from "./layouts/Admin";
import EntrenadorLayout from "./layouts/Entrenador"
import ClienteLayout from "./layouts/Cliente"
import RecepcionistaLayout from "./layouts/Recepcionista"
import { VerificarToken ,VerificarRol} from "./components/Seguridad/VerificarToken";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <VerificarToken/>
      <VerificarRol/>
      <Routes>
        <Route path="/admin/*" element={<UsuarioLayout />} />
        <Route path="/auth/*" element={<AuthLayout />} />
        <Route path="/cliente/*" element={<ClienteLayout />} />
        <Route path="/entrenador/*" element={<EntrenadorLayout />} />
        <Route path="/recepcionista/*" element={<RecepcionistaLayout />} />
        <Route path="*" element={<Navigate to="/auth/index" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
