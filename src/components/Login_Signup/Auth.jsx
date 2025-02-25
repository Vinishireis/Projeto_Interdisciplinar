import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const isSignUp = searchParams.get("mode") === "signup";
  const [isLogin, setIsLogin] = useState(!isSignUp);
  const navigate = useNavigate();

  // Estados para os campos do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [tipo, setTipo] = useState("pessoa_fisica");
  const [erro, setErro] = useState("");

  // Função para validar o e-mail
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    // Validações no frontend
    if (!isLogin && senha !== confirmarSenha) {
      setErro("As senhas não coincidem!");
      return;
    }

    if (!validarEmail(email)) {
      setErro("E-mail inválido.");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    const url = isLogin ? "http://localhost:5000/login" : "http://localhost:5000/signup";
    const data = isLogin
      ? { email, senha } // Removido o campo "tipo" do login
      : { nome, email, senha, tipo };

    try {
      const response = await axios.post(url, data);
      console.log("Resposta do servidor:", response.data);

      if (isLogin) {
        alert("Login bem-sucedido!");
        navigate("/"); // Redireciona para a tela de início
      } else {
        alert("Cadastro bem-sucedido!");
        setIsLogin(true); // Alternar para a tela de login
      }
    } catch (error) {
      console.error("Erro:", error.response?.data || error.message);
      setErro(error.response?.data?.message || "Ocorreu um erro. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-400 to-orange-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 space-y-8 transform transition-all duration-300 hover:scale-105">
        {/* Alternar entre Login e Inscreva-se */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setIsLogin(true)}
            className={`text-lg font-semibold ${
              isLogin
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-400 hover:text-orange-600"
            } transition-colors duration-200`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`text-lg font-semibold ${
              !isLogin
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-400 hover:text-orange-600"
            } transition-colors duration-200`}
          >
            Inscreva-se
          </button>
        </div>

        {/* Mensagem de erro */}
        {erro && (
          <div className="text-center text-red-600 text-sm">
            {erro}
          </div>
        )}

        {/* Formulário */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Confirme a Senha</label>
              <input
                type="password"
                placeholder="Confirme sua senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          )}
          {/* Campo de seleção para o tipo de usuário */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Tipo de Usuário</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              required
            >
              <option value="pessoa_fisica">Pessoa Física</option>
              <option value="colaborador">Colaborador</option>
              <option value="voluntario">Voluntário</option>
              <option value="desenvolvedor">Desenvolvedor</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition-all duration-200 transform hover:scale-105"
            >
              {isLogin ? "Entrar" : "Criar Conta"}
            </button>
          </div>
          {isLogin && (
            <div className="text-center">
              <a
                href="/forgot-password"
                className="text-sm text-orange-600 hover:text-orange-700 transition-colors duration-200"
              >
                Esqueceu a senha?
              </a>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Auth;