"use client";

import { motion } from "framer-motion";

const sections = [
  {
    label: "About",
    content:
      "Building full-stack applications with modern web technologies, specializing in React, Next.js, and Node.js ecosystems.",
  },
  {
    label: "Education",
    content: "B.Tech in Computer Engineering — in progress.",
  },
  {
    label: "Career Goals",
    content:
      "To contribute to meaningful products at an engineering-forward company and grow as a software architect.",
  },
  {
    label: "Interests",
    content:
      "Open-source projects, AI/ML applications, system design, and coffee-driven late-night coding sessions.",
  },
];

export default function AboutPanel() {
  return (
    <div
      className="w-full max-w-[600px] mx-auto rounded-2xl overflow-y-auto"
      style={{
        background: "rgba(5, 5, 20, 0.92)",
        maxHeight: "80vh",
      }}
    >
      {/* Name + role */}
      <motion.div
        className="px-6 pt-6 pb-4 border-b border-neutral-700/50"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl font-bold text-white">Aditya Patil</h2>
        <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-400 border border-teal-500/30">
          Full Stack Developer
        </span>
      </motion.div>

      {/* Sections */}
      <div className="p-6 flex flex-col gap-6">
        {sections.map((section, index) => (
          <motion.div
            key={section.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index + 1) * 0.15, duration: 0.4 }}
          >
            <h3 className="text-teal-400 text-xs font-semibold tracking-widest uppercase mb-2">
              {section.label}
            </h3>
            <p className="text-neutral-300 text-sm leading-relaxed">
              {section.content}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
