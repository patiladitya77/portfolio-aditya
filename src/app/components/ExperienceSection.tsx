"use client";

import Image from "next/image";
import { Briefcase } from "lucide-react";

const formatDate = (date: string) =>
  new Date(date + "-01").toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });

const getDuration = (start: string, end?: string | null) => {
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

export interface Experience {
  _id: string;
  role: string;
  company: string;
  workLocation: string;
  startDate: string;
  endDate: string | null;
  description: string[];
  isCurrent: boolean;
  skills: string[];
}

interface Props {
  experiences: Experience[];
}

const ExperienceSection = ({ experiences }: Props) => {
  return (
    <section
      id="experience"
      className="bg-neutral-800 px-8 py-24 border-t border-neutral-700"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* LEFT – Illustration */}
        <div className="flex justify-center">
          <Image
            src="./computer.svg"
            alt="Work Illustration"
            width={448}
            height={448}
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
            {experiences.length === 0 && (
              <p className="text-neutral-500">No experience entries yet.</p>
            )}
            {experiences.map((exp) => (
              <div
                key={exp._id}
                className="relative bg-neutral-900/60 border border-neutral-700 rounded-2xl p-6 hover:border-neutral-600 transition-all duration-300"
              >
                <p className="text-teal-400 text-sm mb-2">
                  {formatDate(exp.startDate)} –{" "}
                  {exp.isCurrent || !exp.endDate
                    ? "Present"
                    : formatDate(exp.endDate)}
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
                      {exp.workLocation && `, ${exp.workLocation}`}
                    </p>
                    {exp.description?.length > 0 && (
                      <ul className="text-neutral-400 mt-2 text-sm leading-relaxed list-disc list-inside space-y-1">
                        {exp.description.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    )}
                    <p className="text-neutral-500 text-sm mt-2">
                      {getDuration(exp.startDate, exp.endDate)}
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
