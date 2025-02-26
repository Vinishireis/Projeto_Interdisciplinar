import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { SlideRight, SlideLeft } from "../../utility/animation";
import validator from "validator"; // Para sanitização

const Auth = () => {
  const [searchParams] = useSearchParams();
  const isSignUp = searchParams.get("mode") === "signup";
  const [isLogin, setIsLogin] = useState(!isSignUp);
  const navigate = useNavigate();

  // Estados para os campos do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false); // Estado para controlar a visibilidade da senha
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false); // Estado para controlar a visibilidade da confirmação de senha
  const [tipo, setTipo] = useState("pessoa_fisica");
  const [erro, setErro] = useState("");
  const [tentativasLogin, setTentativasLogin] = useState(0);

  // Funções de validação
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarSenha = (senha) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(senha);
  };

  const validarNome = (nome) => {
    const regex = /^[A-Za-zÀ-ú\s]+$/;
    return regex.test(nome);
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
  
    if (!validarSenha(senha)) {
      setErro("A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.");
      return;
    }
  
    if (!isLogin && !validarNome(nome)) {
      setErro("O nome não pode conter números ou caracteres especiais.");
      return;
    }
  
    // Sanitização dos dados
    const sanitizedNome = validator.escape(nome);
    const sanitizedEmail = validator.normalizeEmail(email);
    const sanitizedSenha = validator.escape(senha);
  
    const url = isLogin ? "http://localhost:5000/login" : "http://localhost:5000/signup";
    const data = isLogin
      ? { email: sanitizedEmail, senha: sanitizedSenha }
      : { nome: sanitizedNome, email: sanitizedEmail, senha: sanitizedSenha, tipo };

      const userType = localStorage.getItem("userType");

    try {
      const response = await axios.post(url, data);
      console.log("Resposta do servidor:", response.data);
  
      if (isLogin) {
        alert("Login bem-sucedido!");
        // Armazena o nome do usuário no localStorage
        localStorage.setItem("userName", response.data.nome);
        localStorage.setItem("userType", response.data.tipo);
        console.log("Nome armazenado:", response.data.nome);
        console.log("Tipo de usuário:", response.data.tipo);
        navigate("/"); // Redireciona para a tela de início
      } else {
        alert("Cadastro bem-sucedido!");
        // Armazena o nome do usuário no localStorage após o cadastro
        localStorage.setItem("userName", sanitizedNome);
        console.log("Nome armazenado:", sanitizedNome);
        setIsLogin(true); // Alternar para a tela de login
      }
    } catch (error) {
      console.error("Erro:", error.response?.data || error.message);
      setErro(error.response?.data?.message || "Ocorreu um erro. Tente novamente.");
  
      if (isLogin) {
        setTentativasLogin(tentativasLogin + 1);
        if (tentativasLogin >= 3) {
          setErro("Muitas tentativas de login. Tente novamente mais tarde.");
          return;
        }
      }
    }
    //Axios envia para a Rota Restrita 
    axios.get("/rota-restrita", {
      headers: {
        "user-type": localStorage.getItem("userType"), // Envia o tipo de usuário no cabeçalho
      },
    });
  };

  return (
    <div className="container min-h-[650px] relative py-14">
      {/* Conteúdo principal */}
      <div className="relative z-10">
        <motion.h1
          variants={SlideRight(0.4)}
          initial="hidden"
          animate="visible"
          className="text-5xl font-semibold lg:text-6xl !leading-tight text-center md:text-left"
        >
          {isLogin ? "Faça Login" : "Crie sua Conta"}
        </motion.h1>

        {/* Formulário */}
        <motion.form
          variants={SlideRight(1.0)}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 max-w-md mx-auto"
        >
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Nome Completo</label>
              <input
                type="text"
                placeholder="Seu Nome Completo"
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
            <div className="relative">
              <input
                type={mostrarSenha ? "text" : "password"} // Alterna entre "text" e "password"
                placeholder="Sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)} // Alterna o estado de mostrarSenha
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {mostrarSenha ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Confirme a Senha</label>
              <div className="relative">
                <input
                  type={mostrarConfirmarSenha ? "text" : "password"} // Alterna entre "text" e "password"
                  placeholder="Confirme sua senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)} // Alterna o estado de mostrarConfirmarSenha
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {mostrarConfirmarSenha ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}
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
          {erro && (
            <div className="text-center text-red-600 text-sm mt-4">
              {erro}
            </div>
          )}
        </motion.form>
      </div>
    </div>
  );
};

export default Auth;