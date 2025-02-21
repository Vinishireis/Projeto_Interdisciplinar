import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaEnvelope, FaArrowRight } from "react-icons/fa";
import { SlideRight, SlideLeft } from "../../utility/animation"; // Certifique-se de que as animações estão corretas
import { Link } from "react-router-dom"; // Importe o Link do react-router-dom

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true); // Estado para alternar entre Login e Inscreva-se

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 relative">
        {/* Alternar entre Login e Inscreva-se */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setIsLogin(true)}
            className={`text-lg font-semibold ${
              isLogin ? "text-primary" : "text-gray-400"
            } hover:text-primary transition-colors duration-200`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`text-lg font-semibold ${
              !isLogin ? "text-primary" : "text-gray-400"
            } hover:text-primary transition-colors duration-200`}
          >
            Inscreva-se
          </button>
        </div>

        {/* Formulário */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          className="bg-white p-8 rounded-lg shadow-lg"
        >
          <h2 className="text-3xl font-bold text-center mb-6">
            {isLogin ? "Faça Login" : "Crie sua Conta"}
          </h2>
          <form className="space-y-6">
            {!isLogin && (
              <motion.div
                variants={SlideRight(0.4)}
                initial="hidden"
                animate="visible"
                className="space-y-1"
              >
                <label className="text-sm font-medium text-gray-700">Nome</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Seu nome"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </motion.div>
            )}
            <motion.div
              variants={SlideRight(0.6)}
              initial="hidden"
              animate="visible"
              className="space-y-1"
            >
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Seu email"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </motion.div>
            <motion.div
              variants={SlideRight(0.8)}
              initial="hidden"
              animate="visible"
              className="space-y-1"
            >
              <label className="text-sm font-medium text-gray-700">Senha</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Sua senha"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </motion.div>
            {!isLogin && (
              <motion.div
                variants={SlideRight(1.0)}
                initial="hidden"
                animate="visible"
                className="space-y-1"
              >
                <label className="text-sm font-medium text-gray-700">Confirme a Senha</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Confirme sua senha"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </motion.div>
            )}
            <motion.div
              variants={SlideRight(1.2)}
              initial="hidden"
              animate="visible"
              className="flex items-center justify-between"
            >
              <button
                type="submit"
                className="primary-btn flex items-center gap-2"
              >
                {isLogin ? "Entrar" : "Criar Conta"}
                <FaArrowRight />
              </button>
              {isLogin && (
                <a href="#!" className="text-sm text-primary hover:underline">
                  Esqueceu a senha?
                </a>
              )}
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;