"use client";

import { motion } from "framer-motion";

/**
 * MonitorPanel — GitHub contribution stats and tech activity (static/mocked).
 * Requirements: 9.2
 */

const CONTRIBUTION_WEEKS = Array.from({ length: 52 }, (_, weekIndex) =>
  Array.from({ length: 7 }, (_, dayIndex) => {
    // Seed a pseudo-random activity level (0–4) based on position
    const seed = (weekIndex * 7 + dayIndex * 13 + weekIndex * dayIndex) % 5;
    return seed;
  }),
);

const ACTIVITY_LEVEL_COLORS: Record<number, string> = {
  0: "#161b22",
  1: "#0e4429",
  2: "#006d32",
  3: "#26a641",
  4: "#39d353",
};

const RECENT_ACTIVITY = [
  { label: "Commits this month", value: "42", icon: "📝" },
  { label: "Pull requests merged", value: "8", icon: "🔀" },
  { label: "Issues closed", value: "15", icon: "✅" },
  { label: "Repositories", value: "23", icon: "📦" },
];

const TOP_LANGUAGES = [
  { name: "TypeScript", percent: 48, color: "#3178c6" },
  { name: "JavaScript", percent: 28, color: "#f1e05a" },
  { name: "Java", percent: 14, color: "#b07219" },
  { name: "CSS", percent: 10, color: "#563d7c" },
];

export default function MonitorPanel() {
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
        <h2 className="text-2xl font-bold text-white">GitHub Activity</h2>
        <a
          href="https://github.com/patiladitya77"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-400 text-sm mt-1 hover:text-teal-400 transition-colors"
        >
          @patiladitya77
        </a>
      </div>

      <div className="p-6 space-y-8">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {RECENT_ACTIVITY.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-neutral-800/60 border border-neutral-700 rounded-xl p-4"
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-white font-bold text-xl">{item.value}</div>
              <div className="text-neutral-400 text-xs mt-0.5">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contribution heatmap */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-teal-400 text-xs font-semibold tracking-widest uppercase mb-3">
            Contribution Activity
          </h3>
          <div className="flex gap-0.5 overflow-x-auto pb-2">
            {CONTRIBUTION_WEEKS.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map((level, di) => (
                  <div
                    key={di}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      backgroundColor:
                        ACTIVITY_LEVEL_COLORS[level] ??
                        ACTIVITY_LEVEL_COLORS[0],
                    }}
                    title={`Week ${wi + 1}, day ${di + 1}`}
                  />
                ))}
              </div>
            ))}
          </div>
          {/* Legend */}
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-neutral-500 text-xs">Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  backgroundColor: ACTIVITY_LEVEL_COLORS[level],
                }}
              />
            ))}
            <span className="text-neutral-500 text-xs">More</span>
          </div>
        </motion.div>

        {/* Top languages */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-teal-400 text-xs font-semibold tracking-widest uppercase mb-3">
            Top Languages
          </h3>
          <div className="space-y-3">
            {TOP_LANGUAGES.map((lang) => (
              <div key={lang.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-neutral-300">{lang.name}</span>
                  <span className="text-neutral-500">{lang.percent}%</span>
                </div>
                <div className="h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${lang.percent}%` }}
                    transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                    style={{ backgroundColor: lang.color }}
                    className="h-full rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
