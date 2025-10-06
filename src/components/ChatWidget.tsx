"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot, FaPaperPlane, FaTimes, FaComment } from "react-icons/fa";
import { useRouter } from "next/navigation";

type Msg = {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  createdAt: number;
};

const SYSTEM_PROMPT =
  "You are an expert Agentic AI developer assistant. Be concise, helpful, and suggest actionable next steps. Use short, elegant language.";

export default function ChatWidget() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "👋 Hey! I’m your AI assistant. Ask me about your portfolio, Agentic AI, or Next.js projects.",
      createdAt: Date.now(),
    },
  ]);
  const [isSending, setIsSending] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const genId = (prefix = "") => `${prefix}${Date.now()}-${Math.random()}`;

  // Auto hide greeting
  useEffect(() => {
    const timer = setTimeout(() => setShowGreeting(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  // SSE: Listen to backend events
  useEffect(() => {
    const evtSource = new EventSource(
      "https://muhammadumar-backend.vercel.app/"
    );

    evtSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.action === "show_categories") {
          router.push("/categories");
        }
      } catch (err) {
        console.error("SSE parse error:", err);
      }
    };

    return () => {
      evtSource.close();
    };
  }, [router]);

  // Send Message to FastAPI backend
  const handleSend = async (promptText?: string) => {
    const text = (promptText ?? input).trim();
    if (!text) return;
    setIsSending(true);

    const userMsg: Msg = {
      id: genId("u-"),
      role: "user",
      text,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const placeholder: Msg = {
      id: genId("a-"),
      role: "assistant",
      text: "•••",
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, placeholder]);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "umar",
          message: text,
        }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();

      const reply = data.reply || "🤖 No response from model.";

      setMessages((prev) =>
        prev.map((m) =>
          m.id === placeholder.id ? { ...m, text: reply } : m
        )
      );
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === placeholder.id
            ? { ...m, text: "❌ Server error. Please try again later." }
            : m
        )
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Greeting Popup */}
      <AnimatePresence>
        {showGreeting && !open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-24 right-6 bg-white/90 backdrop-blur-lg border border-gray-200 shadow-xl rounded-2xl p-4 w-[260px] z-50"
          >
            <div className="flex items-start gap-2">
              <div>
                <h3 className="text-emerald-600 font-bold text-lg">
                  Hi! I’m UmarBot 👋
                </h3>
                <p className="text-gray-700 text-sm mt-1">
                  How can I assist you today?
                </p>
              </div>
              <button
                onClick={() => setShowGreeting(false)}
                className="text-gray-500 hover:text-gray-800 transition"
              >
                <FaTimes size={14} />
              </button>
            </div>
            <div className="absolute bottom-[-6px] right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white/90" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => {
              setOpen(true);
              setShowGreeting(false);
            }}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center rounded-full 
              bg-gradient-to-br from-emerald-500 to-teal-400 shadow-xl hover:shadow-2xl text-white 
              hover:scale-105 transition-all"
          >
            <FaComment size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] md:w-[420px] max-h-[75vh] 
              rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.15)] 
              bg-white border border-gray-200 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white text-lg font-bold shadow-md">
                  <FaRobot />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Agentic AI Assistant
                  </h3>
                  <p className="text-xs text-gray-500">Your coding copilot</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setMessages([])}
                  className="text-xs text-gray-400 hover:text-gray-700"
                >
                  Clear
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-400 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-3 bg-gradient-to-b from-gray-50 to-white space-y-4"
            >
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-start gap-3 ${
                    m.role === "user" ? "flex-row-reverse text-right" : ""
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      m.role === "assistant"
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-900 text-white"
                    }`}
                  >
                    {m.role === "assistant" ? <FaRobot /> : "U"}
                  </div>
                  <div
                    className={`max-w-[75%] text-sm rounded-2xl px-4 py-3 leading-relaxed shadow-sm ${
                      m.role === "assistant"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-emerald-500 text-white"
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {isSending && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                    <FaRobot />
                  </div>
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce" />
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce delay-100" />
                    <div className="h-2 w-2 rounded-full bg-emerald-300 animate-bounce delay-200" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-gray-100 p-3 bg-white flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about AI agents or Next.js..."
                className="flex-1 px-4 text-black py-2 text-sm rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="p-2 rounded-full bg-emerald-500 text-white shadow-md hover:bg-emerald-600 transition disabled:opacity-50"
              >
                <FaPaperPlane />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
