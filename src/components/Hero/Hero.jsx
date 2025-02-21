import React from "react";
import HeroImg from "../../assets/hero.png"; // Certifique-se de que a imagem está correta
import { FaPlay } from "react-icons/fa";
import { motion } from "framer-motion";
import { SlideRight } from "../../utility/animation";

const Hero = () => {
  return (
    <>
      <div className="container grid grid-cols-1 md:grid-cols-2 min-h-[650px] relative">
        {/* Texto de fundo */}
        <div className="absolute inset-0 flex justify-center items-center">
          <h1 className="text-[100px] md:text-[150px] lg:text-[150px] font-bold text-gray-300 opacity-20 text-center -z-10">
            Educação criativa <br /> e inovadora
          </h1>
        </div>
        {/* Informações do Instituto Criativo */}
        <div className="flex flex-col justify-center py-14 md:pr-16 xl:pr-40 md:py-0 relative z-10">
          <div className="text-center md:text-left space-y-6">
            <motion.p
              variants={SlideRight(0.4)}
              initial="hidden"
              animate="visible"
              className="text-orange-600 uppercase font-semibold"
            >
              Transformando Ideias em Realidade
            </motion.p>
            <motion.h1
              variants={SlideRight(0.6)}
              initial="hidden"
              animate="visible"
              className="text-5xl font-semibold lg:text-6xl !leading-tight"
            >
              Educação criativa <span className="text-primary"> e inovadora</span>
            </motion.h1>
            <motion.p
              variants={SlideRight(0.8)}
              initial="hidden"
              animate="visible"
            >
              O Instituto Criativo é uma ONG que nasceu para transformar a vida das pessoas.
            </motion.p>
            {/* Botões de ação */}
            <motion.div
              variants={SlideRight(1.0)}
              initial="hidden"
              animate="visible"
              className="flex gap-8 justify-center md:justify-start !mt-8 items-center"
            >
              <button className="primary-btn">Comece Agora</button>
              <button className="flex justify-end items-center gap-2 font-semibold">
                <span className="w-10 h-10 bg-secondary/15 rounded-full flex justify-center items-center">
                  <FaPlay className="text-secondary" />
                </span>
                Veja como funciona
              </button>
            </motion.div>
          </div>
        </div>
        {/* Imagem do Hero */}
        <div className="flex justify-center items-center relative z-10">
          <motion.img
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            src={HeroImg}
            alt="Instituto Criativo"
            className="w-[350px] md:w-[550px] xl:w-[700px]"
          />
        </div>
      </div>
    </>
  );
};

export default Hero;