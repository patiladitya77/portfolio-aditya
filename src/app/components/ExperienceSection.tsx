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
    location: "Mumbai",
    start: "2025-12",
    description: "Working on full-stack systems and scalable backend services.",
  },
];

const ExperienceSection = () => {
  return (
    <section
      id="experience"
      className="min-h-screen bg-black px-8 py-24 flex items-center"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* LEFT – Illustration */}
        <div className="flex justify-center">
          <img
            src="./computer.svg"
            alt="Work Illustration"
            className="max-w-md w-full object-contain"
          />
        </div>

        {/* RIGHT – Experience Cards */}
        <div>
          <div className="inline-block mb-10 px-6 py-2 rounded-full bg-purple-600/10 text-purple-400">
            Experiences
          </div>

          <div className="space-y-8">
            {experiences.map((exp, i) => (
              <div
                key={i}
                className="relative bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6"
              >
                {/* Date */}
                <p className="text-teal-400 text-sm mb-2">
                  ({formatDate(exp.start)} –{" "}
                  {exp.end ? formatDate(exp.end) : "Present"})
                </p>

                <div className="flex gap-4 items-start">
                  {/* Icon */}
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-purple-600/20 text-purple-400">
                    <Briefcase />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {exp.role}
                    </h3>
                    <p className="text-neutral-300">
                      {exp.company}
                      {exp.location && `, ${exp.location}`}
                    </p>

                    {exp.description && (
                      <p className="text-neutral-400 mt-2">{exp.description}</p>
                    )}

                    <p className="text-neutral-500 text-sm mt-2">
                      {getDuration(exp.start, exp.end)}
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
