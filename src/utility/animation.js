import { motion } from 'framer-motion';

// SlideUp com easing e escala
export const SlideUp = (delay) => {
  return {
    hidden: {
      opacity: 0,
      y: 100,
      scale: 0.95, // Adiciona um efeito de escala
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1, // Retorna à escala normal
      transition: {
        duration: 0.8, // Duração reduzida para ser mais suave
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1], // Easing personalizado
      },
    },
    exit: {
      opacity: 0,
      y: 100,
      scale: 0.95,
      transition: {
        duration: 0.6, // Duração de saída mais rápida
        ease: "easeInOut",
      },
    },
  };
};

// SlideLeft com easing e rotação
export const SlideLeft = (delay) => {
  return {
    hidden: {
      opacity: 0,
      x: 100,
      rotate: -10, // Adiciona uma leve rotação
    },
    visible: {
      opacity: 1,
      x: 0,
      rotate: 0, // Retorna à rotação normal
      transition: {
        duration: 0.8,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
    exit: {
      opacity: 0,
      x: 100,
      rotate: -10,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
  };
};

// SlideRight com easing e rotação
export const SlideRight = (delay) => {
  return {
    hidden: {
      opacity: 0,
      x: -100,
      rotate: 10, // Adiciona uma leve rotação
    },
    visible: {
      opacity: 1,
      x: 0,
      rotate: 0, // Retorna à rotação normal
      transition: {
        duration: 0.8,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
    exit: {
      opacity: 0,
      x: -100,
      rotate: 10,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
  };
};