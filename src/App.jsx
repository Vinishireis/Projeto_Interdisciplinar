import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./Home"; // Mova a Home para um arquivo separado
import Auth from "./components/Login_Signup/Auth";
import ResetPassword from "./components/Login_Signup/ResetPassword";
import ForgotPassword from "./components/Login_Signup/ForgotPassword";

const App = () => {
  const isAuthenticated = false; // Simule um usuário autenticado (troque para `true` se necessário)
  const location = useLocation();

  return (
    <>
      {/* Navbar não visível na tela de Auth, Esqueci a Senha e Redefinir Senha */}
      {!["/auth", "/forgot-password", "/reset-password"].includes(location.pathname) && <Navbar />}
      
      <Routes>
        {/* Página Inicial */}
        <Route path="/" element={<Home />} />

        {/* Página de Login/Registro */}
        <Route path="/auth" element={<Auth />} />

        {/* Página de Esqueci a Senha */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Página de Redefinir Senha */}
        <Route path="/reset-password" element={<ResetPassword />} />

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