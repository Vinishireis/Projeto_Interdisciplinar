import React, { useState } from "react";
import { useSearchParams } from "react-router-dom"; // Importe useSearchParams

const Auth = () => {
  const [searchParams] = useSearchParams();
  const isSignUp = searchParams.get("mode") === "signup"; // Verifica se o modo é "signup"
  const [isLogin, setIsLogin] = useState(!isSignUp); // Define o estado inicial com base no modo

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

        {/* Formulário */}
        <form className="mt-8 space-y-6">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                placeholder="Seu nome"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Seu email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              placeholder="Sua senha"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Confirme a Senha</label>
              <input
                type="password"
                placeholder="Confirme sua senha"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          )}
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
                href="#!"
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