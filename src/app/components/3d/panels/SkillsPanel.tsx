"use client";

import { motion } from "framer-motion";

export interface SkillCategory {
  label: string;
  skills: string[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    label: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  { label: "Backend", skills: ["Node.js", "Express", "Spring Boot"] },
  { label: "Databases", skills: ["MongoDB", "PostgreSQL"] },
  { label: "DevOps", skills: ["Docker", "AWS", "Terraform"] },
  { label: "AI/ML", skills: ["LangChain", "OpenAI API"] },
  { label: "Tools", skills: ["Git", "Postman", "Figma"] },
];

export default function SkillsPanel() {
  // Build a flat index so stagger delay is continuous across all categories
  let flatIndex = 0;

  return (
    <div
      className="w-full max-w-[700px] mx-auto rounded-2xl overflow-y-auto"
      style={{
        background: "rgba(5, 5, 20, 0.92)",
        maxHeight: "80vh",
      }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-neutral-700/50">
        <h2 className="text-2xl font-bold text-white">Skills</h2>
        <p className="text-neutral-400 text-sm mt-1">
          Technologies I work with
        </p>
      </div>

      {/* Categories */}
      <div className="p-6 flex flex-col gap-6">
        {SKILL_CATEGORIES.map((category) => (
          <div key={category.label}>
            {/* Category header */}
            <p className="text-teal-400 text-xs tracking-wider uppercase mb-3">
              {category.label}
            </p>

            {/* Skill badges */}
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => {
                const currentIndex = flatIndex++;
                return (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: currentIndex * 0.05 }}
                    className="bg-neutral-700 text-neutral-300 border border-neutral-600 rounded-full px-3 py-1 text-xs"
                  >
                    {skill}
                  </motion.span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
