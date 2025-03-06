import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./Home"; // Mova a Home para um arquivo separado
import Auth from "./components/Login_Signup/Auth";
import ResetPassword from "./components/Login_Signup/ResetPassword";
import ForgotPassword from "./components/Login_Signup/ForgotPassword";
import FAQ from "./components/FAQ/FAQ";
import Contact from "./components/Contact/Contact";
import TermsConditions from "./components/TermsConditions/TermsConditions";
import PrivacyPolicy from "./components/PrivacyPolicy/PrivacyPolicy";
import ProfileSettings from "./components/ProfileSettings/ProfileSettings ";
import SocialImpact from "./components/Socialmpact/SocialImpact";
import Segment from "./components/Segment/Segment"; 


const App = () => {
  const isAuthenticated = true; // Simule um usuário autenticado (troque para `true` se necessário)
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
        <Route path="/dashboard" element={isAuthenticated ? <h1>Dashboard</h1> : <Navigate to="/auth" />} />

        {/* Rota FAQ */}
        <Route path="/faq" element={<FAQ />} />

        {/* Rota Contato */}  
        <Route path="/contact" element={<Contact />} />

        {/* Rota Termos e Condições */}
        <Route path="/termsconditions" element={<TermsConditions />} />

        {/* Rota Política de Privacidade */}
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        
        {/* Rota 404 */}
        <Route path="*" element={<h1>Página não encontrada</h1>} />

        {/* Rota Tela de Configurações de Perfil */}
        <Route path="/profile-settings" element={<ProfileSettings />} />

        {/* Rota Impacto Social */}   
        <Route path="/social-impact" element={<SocialImpact />} />  
        
        {/* Rota Segmento */}
        <Route path="/segment" element={<Segment />} />
    
        {/* Rota Sobre Nós */}
      </Routes>
    </>
  );
};

export default App;