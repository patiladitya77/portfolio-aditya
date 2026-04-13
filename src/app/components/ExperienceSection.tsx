"use client";

import { Briefcase } from "lucide-react";

const formatDate = (date: string) =>
  new Date(date + "-01").toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });

const getDuration = (start: string, end?: string) => {
  const startDate = new Date(start + "-01");
  const endDate = end ? new Date(end + "-01") : new Date();
  let months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());
  const years = Math.floor(months / 12);
  months %= 12;
  if (years && months) return `${years} yr ${months} mo`;
  if (years) return `${years} yr`;
  return `${months} mo`;
};

const experiences = [
  {
    role: "SDE Intern",
    company: "Zenlynx Technologies",
    location: "Remote",
    start: "2025-12",
    description: "Working on full-stack systems",
    end: "2026-04",
  },
];

const ExperienceSection = () => {
  return (
    <section
      id="experience"
      className="bg-neutral-800 px-8 py-24 border-t border-neutral-700"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* LEFT – Illustration */}
        <div className="flex justify-center">
          <img
            src="./computer.svg"
            alt="Work Illustration"
            className="max-w-md w-full object-contain opacity-90"
          />
        </div>

        {/* RIGHT – Experience Cards */}
        <div>
          <p className="text-teal-400 text-sm tracking-widest mb-4">
            MY JOURNEY
          </p>
          <div className="inline-block mb-10 px-6 py-2 rounded-full bg-purple-600/10 border border-purple-500/20 text-purple-400">
            Experiences
          </div>

          <div className="space-y-8">
            {experiences.map((exp, i) => (
              <div
                key={i}
                className="relative bg-neutral-900/60 border border-neutral-700 rounded-2xl p-6 hover:border-neutral-600 transition-all duration-300"
              >
                <p className="text-teal-400 text-sm mb-2">
                  {formatDate(exp.start)} –{" "}
                  {(exp as any).end ? formatDate((exp as any).end) : "Present"}
                </p>

                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/20">
                    <Briefcase size={20} />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {exp.role}
                    </h3>
                    <p className="text-neutral-300">
                      {exp.company}
                      {exp.location && `, ${exp.location}`}
                    </p>
                    {exp.description && (
                      <p className="text-neutral-400 mt-2 text-sm leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                    <p className="text-neutral-500 text-sm mt-2">
                      {getDuration(exp.start, (exp as any).end)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
