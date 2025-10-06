"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { ISourceOptions, MoveDirection } from "@tsparticles/engine";
import { motion } from "framer-motion";
import { FaLinkedin, FaTwitter, FaComments } from "react-icons/fa";
import { SiUpwork, SiFiverr } from "react-icons/si";

const Hero = () => {
  const [, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const particlesOptions: ISourceOptions = {
    background: { color: { value: "#ffffff" } },
    particles: {
      number: { value: 100, density: { enable: true } },
      color: { value: "#10b981" },
      shape: { type: "circle" },
      opacity: { value: 0.3 },
      size: { value: { min: 1, max: 3 } },
      links: {
        enable: true,
        distance: 150,
        color: "#10b981",
        opacity: 0.2,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1.2,
        direction: MoveDirection.none,
        outModes: "out",
      },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
        onClick: { enable: true, mode: "push" },
      },
      modes: { repulse: { distance: 150 }, push: { quantity: 3 } },
    },
    detectRetina: true,
  };

  const socialLinks = [
    { icon: <FaLinkedin />, link: "https://linkedin.com", color: "hover:text-[#0A66C2]" },
    { icon: <SiUpwork />, link: "https://upwork.com", color: "hover:text-green-600" },
    { icon: <SiFiverr />, link: "https://fiverr.com", color: "hover:text-[#1DBF73]" },
    { icon: <FaTwitter />, link: "https://twitter.com", color: "hover:text-[#1DA1F2]" },
    { icon: <FaComments />, link: "#chat", color: "hover:text-emerald-600" },
  ];

  return (
    <section className="relative flex items-center justify-center min-h-[90vh] sm:min-h-screen text-center px-4 sm:px-8 md:px-12 overflow-hidden font-[Inter]">
      {/* Background Particles */}
      <Particles
        id="tsparticles"
        options={particlesOptions}
        className="absolute inset-0 w-full h-full -z-10"
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 flex flex-col items-center justify-center space-y-5 max-w-3xl"
      >
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-gray-600 font-medium"
        >
          👋 Hello, I am
        </motion.h2>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight"
        >
          Hafiz{" "}
          <span className="relative text-emerald-600 inline-block">
            Muhammad Umar
            <span className="absolute left-0 -bottom-2 w-full h-1 rounded-md bg-gradient-to-r from-green-500 to-emerald-600"></span>
          </span>
        </motion.h1>

        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-700"
        >
          🚀 Expert <span className="text-emerald-600">Agentic AI Engineer</span>
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-2xl mt-3 text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed tracking-wide"
        >
          I design and build intelligent, scalable systems that merge{" "}
          <span className="font-semibold text-gray-800">full-stack development</span> with{" "}
          <span className="font-semibold text-emerald-600">cutting-edge AI</span>, creating
          solutions that drive innovation and real-world impact.
        </motion.p>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-5 p-3 sm:p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-gray-200 shadow-md"
        >
          {socialLinks.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full 
                bg-gradient-to-br from-emerald-100 to-white text-gray-700 text-lg sm:text-xl 
                transition transform hover:scale-110 shadow-sm ${item.color}`}
            >
              {item.icon}
            </a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
