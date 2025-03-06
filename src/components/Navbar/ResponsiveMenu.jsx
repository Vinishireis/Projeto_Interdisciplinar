import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { NavbarMenu } from "../../mockData/data.js";

const ResponsiveMenu = ({ isOpen }) => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  // Verifica se há um nome de usuário no localStorage ao carregar o componente
  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) {
      setUserName(name);
    }
  }, []);

  // Função para lidar com o logout
  const handleLogout = () => {
    localStorage.removeItem("userName"); // Remove o nome do usuário
    setUserName(""); // Limpa o estado
    navigate("/"); // Redireciona para a página inicial
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.3 }}
          className="absolute top-20 left-0 w-full h-screen z-20 bg-primary lg:hidden"
        >
          <div className="text-xl font-semibold uppercase py-10 m-6 rounded-3xl">
            <ul className="flex flex-col justify-center items-center gap-6">
              {NavbarMenu.map((item) => (
                <li key={item.id}>
                  {item.link === "#" ? (
                    <span className="text-gray-400 opacity-50 cursor-not-allowed">
                      {item.title}
                    </span>
                  ) : (
                    <Link
                      to={item.link}
                      className="hover:text-orange-500 transition-colors duration-200"
                    >
                      {item.title}
                    </Link>
                  )}
                </li>
              ))}

              {userName ? (
                <>
                  <li className="text-orange-500">Olá, {userName}!</li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-white bg-red-500 font-semibold rounded-full px-4 py-2"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/auth" className="hover:text-orange-500 transition-colors duration-200">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/auth?mode=signup" className="hover:text-orange-500 transition-colors duration-200">
                      Inscreva-se
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResponsiveMenu;
