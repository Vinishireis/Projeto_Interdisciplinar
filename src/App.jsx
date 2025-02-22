import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./Home"; // Mova a Home para um arquivo separado
import Auth from "./components/Login_Signup/Auth";

const App = () => {
  const isAuthenticated = false; // Simule um usuário autenticado (troque para `true` se necessário)
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/auth" && <Navbar />} {/* Navbar não visível na tela de Auth */}
      <Routes>
        {/* Página Inicial */}
        <Route path="/" element={<Home />} />

        {/* Página de Login/Registro */}
        <Route path="/auth" element={<Auth />} />

        {/* Proteção de Rota: Se não estiver autenticado, redireciona para login */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <h1>Dashboard</h1> : <Navigate to="/auth" />}
        />

        {/* Rota 404 */}
        <Route path="*" element={<h1>Página não encontrada</h1>} />
      </Routes>
    </>
  );
};

export default App;
