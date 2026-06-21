"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ExperienceDTO {
  _id: string;
  role: string;
  company: string;
  workLocation: string;
  startDate: string; // "YYYY-MM" format
  endDate: string | null;
  description: string[];
  isCurrent: boolean;
  skills: string[];
}

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

export default function ExperiencePanel() {
  const [experiences, setExperiences] = useState<ExperienceDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/experiences")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data: ExperienceDTO[]) => {
        setExperiences(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

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
        <h2 className="text-2xl font-bold text-white">Experience</h2>
        <p className="text-neutral-400 text-sm mt-1">My professional journey</p>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <span className="text-neutral-400 text-sm">
              Loading experience...
            </span>
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center justify-center py-16">
            <span className="text-red-400 text-sm">
              Couldn&apos;t load experience — please try again.
            </span>
          </div>
        )}

        {!loading && !error && (
          <div className="relative">
            {/* Animated SVG timeline line */}
            <svg
              className="absolute left-[7px] top-0 w-0.5 overflow-visible"
              style={{ height: "100%" }}
              aria-hidden="true"
            >
              <motion.line
                x1="1"
                y1="0"
                x2="1"
                y2="100%"
                stroke="#2dd4bf"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </svg>

            {/* Timeline entries */}
            <div className="flex flex-col gap-8 pl-7">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp._id}
                  data-testid="experience-entry"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.3 }}
                  className="relative"
                >
                  {/* Timeline dot */}
                  <span
                    className="absolute -left-7 top-1.5 w-3 h-3 rounded-full bg-teal-400 border-2 border-teal-400/40"
                    aria-hidden="true"
                  />

                  {/* Date range */}
                  <p className="text-teal-400 text-xs mb-1">
                    {formatDate(exp.startDate)} –{" "}
                    {exp.isCurrent || !exp.endDate
                      ? "Present"
                      : formatDate(exp.endDate)}{" "}
                    &middot; {getDuration(exp.startDate, exp.endDate)}
                  </p>

                  {/* Role */}
                  <h3 className="text-white font-bold text-base leading-snug">
                    {exp.role}
                  </h3>

                  {/* Company + location */}
                  <p className="text-neutral-300 text-sm mb-2">
                    {exp.company}
                    {exp.workLocation && `, ${exp.workLocation}`}
                  </p>

                  {/* Description list */}
                  {exp.description?.length > 0 && (
                    <ul className="list-disc list-inside space-y-1">
                      {exp.description.map((item, i) => (
                        <li
                          key={i}
                          className="text-neutral-400 text-sm leading-relaxed"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
