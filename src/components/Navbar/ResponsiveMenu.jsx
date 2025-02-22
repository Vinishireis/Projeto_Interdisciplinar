import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom"; // Importe o Link

const ResponsiveMenu = ({ isOpen }) => {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.3 }}
          className="absolute top-20 left-0 w-full h-screen z-20 lg:hidden"
        >
          <div className="text-xl font-semibold uppercase bg-primary text-black py-10 m-6 rounded-3xl">
            <ul className="flex flex-col justify-center items-center gap-10">
              <li>
                <Link to="/" className="hover:text-orange-500 transition-colors duration-200">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="hover:text-orange-500 transition-colors duration-200">
                  Sobre
                </Link>
              </li>
              <li>
                <Link to="/servico" className="hover:text-orange-500 transition-colors duration-200">
                  Serviço
                </Link>
              </li>
              <li>
                <Link to="/galeria" className="hover:text-orange-500 transition-colors duration-200">
                  Galeria
                </Link>
              </li>
              <li>
                <Link to="/contato" className="hover:text-orange-500 transition-colors duration-200">
                  Contato
                </Link>
              </li>
              
              <li>
                <Link to="/blog" className="hover:text-orange-500 transition-colors duration-200">
                  Blog
                </Link>
              </li>
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
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResponsiveMenu;