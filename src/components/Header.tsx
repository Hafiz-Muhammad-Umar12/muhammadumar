"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Services", href: "#services" },
  { name: "Skills", href: "#skills" },
  { name: "Contact", href: "#contact" },
];

 export default function Header() {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScrollY && currentScroll > 100) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      setLastScrollY(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <motion.header
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: showHeader ? 0 : -100, opacity: showHeader ? 1 : 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-white/70 border-b border-gray-100 shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-12 py-4">
        {/* Logo */}
        <Link
          href="#home"
          className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent"
        >
          Umar.dev
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.name}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.07 }}
              className="relative group"
            >
              <Link
                href={link.href}
                className="text-gray-800 font-medium hover:text-emerald-600 transition-all duration-200"
              >
                {link.name}
              </Link>
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-emerald-600 to-teal-400 transition-all duration-300 group-hover:w-full" />
            </motion.div>
          ))}
        </nav>

        {/* Right - Buttons */}
        <div className="flex items-center gap-4">
          <Link
            href="/resume.pdf"
            target="_blank"
            className="hidden md:block bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-5 py-2 rounded-xl shadow-md hover:opacity-90 transition"
          >
            Resume
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-700"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white/90 backdrop-blur-md border-t border-gray-200 py-4 px-6 flex flex-col items-center gap-4 shadow-lg"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 font-semibold text-lg hover:text-emerald-600 transition"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/resume.pdf"
            target="_blank"
            className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-5 py-2 rounded-xl shadow-md hover:opacity-90 transition"
          >
            Resume
          </Link>
        </motion.nav>
      )}
    </motion.header>
  );
}
