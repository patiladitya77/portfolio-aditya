"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center bg-neutral-900 text-white px-10 md:px-16 overflow-hidden border-b border-neutral-800"
    >
      {/* SVG Background */}
      <div
        className="absolute w-[800px] h-[800px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
        style={{
          backgroundImage:
            "url('https://do6gp1uxl3luu.cloudfront.net/assets/Lines.svg')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          filter: "invert(100%) brightness(200%)",
          transform: "rotate(3deg) translate(-50%, -50%)",
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto -mt-20">
        {/* LEFT - Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 space-y-8 text-left md:pl-8"
        >
          <p className="text-teal-400 text-sm tracking-widest">
            WELCOME TO MY PORTFOLIO
          </p>
          <h1 className="text-5xl font-extrabold leading-snug">
            Hello, <br />
            This is{" "}
            <span className="text-yellow-400 drop-shadow-md">Aditya Patil</span>
            , <br />I am a{" "}
            <span className="text-teal-400 drop-shadow-md">
              Full Stack Developer
            </span>
          </h1>

          <div className="flex items-center gap-6 mt-6 cursor-pointer">
            <a
              href="https://www.linkedin.com/in/devwithaditya/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/linkedin.svg"
                width={32}
                height={32}
                className="opacity-80 hover:opacity-100 hover:scale-110 transition duration-200"
                alt="linkedin"
              />
            </a>
            <a
              href="https://github.com/patiladitya77"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/github.svg"
                width={32}
                height={32}
                className="opacity-80 hover:opacity-100 hover:scale-110 transition duration-200 invert"
                alt="github"
              />
            </a>
            <a
              href="https://leetcode.com/u/patiladitya77/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/leetcode.svg"
                width={32}
                height={32}
                className="opacity-80 hover:opacity-100 hover:scale-110 transition duration-200"
                alt="leetcode"
              />
            </a>
          </div>

          <div className="flex gap-6 mt-8">
            <a
              href="#contact"
              className="px-8 py-3 border-2 border-white rounded-full hover:bg-white hover:text-black transition text-lg font-medium"
            >
              Contact Me
            </a>
            <a
              href="https://drive.google.com/file/d/1ip362UH7gowFXGaG29-S0sPrHvV93PI7/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-linear-to-r from-green-400 to-purple-500 rounded-full hover:scale-105 transition text-lg font-medium inline-block"
            >
              Get Resume
            </a>
          </div>
        </motion.div>

        {/* RIGHT - Code Card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex justify-end md:pr-8 mt-12 md:mt-0"
        >
          <div className="bg-neutral-800 border border-neutral-700 text-[#e5e5e5] rounded-xl shadow-2xl p-8 font-mono text-[15px] w-[600px]">
            <div className="flex gap-2 mb-4">
              <span className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="w-3 h-3 bg-yellow-400 rounded-full" />
              <span className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
            <pre className="text-[#cfcfcf] whitespace-pre-wrap leading-relaxed">
              {`const coder = {
  name: 'Aditya Patil',
  role: 'Software Developer',
  skills: {
    frontend: ['React', 'NextJS', 'Tailwind', 'HTML/CSS'],
    backend: ['ExpressJS', 'NodeJS'],
    databases: ['MySQL', 'MongoDB', 'PostgreSQL'],
    tools: ['Git/GitHub', 'VS Code']
  },
  
  greeting: function() {
    return \`Hey! I'm \${this.name}, a \${this.role} ready to build exciting apps.\`;
  },
};`}
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
