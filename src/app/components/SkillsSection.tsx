"use client";

import Image from "next/image";
import { useEffect } from "react";
import { motion } from "framer-motion";

const skills = [
  { name: "React", src: "/skills/react.svg" },
  { name: "Next.js", src: "/skills/nextjs.svg" },
  { name: "Node.js", src: "/skills/nodejs.svg" },
  { name: "TypeScript", src: "/skills/typescript.svg" },
  { name: "MongoDB", src: "/skills/mongodb.svg" },
  { name: "PostgreSQL", src: "/skills/postgres.svg" },
  { name: "Docker", src: "/skills/docker.svg" },
  { name: "AWS", src: "/skills/aws.svg" },
  { name: "Tailwind", src: "/skills/tailwind.svg" },
  { name: "Langchain", src: "/skills/langchain.svg" },
  { name: "Postman", src: "/skills/postman.svg" },
];

const SkillsSection = () => {
  useEffect(() => {
    console.log("[SkillsSection] mounted");
  }, []);

  return (
    <section
      id="skills"
      className="min-h-screen flex flex-col justify-center bg-neutral-800 px-8 py-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 text-center">
          Skills & Technologies
        </h2>
        {/* <p className="text-neutral-400 text-center mb-16 text-lg">
          Tools and frameworks I use to build amazing projects
        </p> */}

        {/* Marquee */}
        <div className="relative">
          {/* Gradient edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-neutral-800 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-neutral-800 to-transparent z-10 pointer-events-none" />

          <div className="overflow-hidden">
            <motion.div
              className="flex w-max flex-nowrap gap-8 py-8"
              animate={{ x: ["0%", "-33.333%"] }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              }}
              whileHover={{
                animationPlayState: "paused",
              }}
            >
              {[...skills, ...skills, ...skills].map((skill, index) => (
                <div key={index} className="shrink-0 group">
                  <div className="relative flex flex-col items-center justify-center w-40 h-40 bg-neutral-700/50 backdrop-blur-sm rounded-2xl border border-neutral-600 hover:border-neutral-500 transition-all duration-300 hover:scale-110 hover:bg-neutral-700">
                    <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Image
                      src={skill.src}
                      alt={skill.name}
                      width={64}
                      height={64}
                      className="object-contain mb-3 opacity-90 group-hover:opacity-100 transition-opacity duration-300 relative z-10"
                    />
                    <span className="text-neutral-300 text-sm font-medium relative z-10">
                      {skill.name}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
