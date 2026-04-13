"use client";

type Education = {
  degree: string;
  institute: string;
  startYear: number;
  endYear: number;
  cgpa?: number;
};

const educationList: Education[] = [
  {
    degree: "B.E. in Information Technology",
    institute: "Don Bosco Institute of Technology, Mumbai",
    startYear: 2023,
    endYear: 2027,
    cgpa: 8.9,
  },
];

const EducationSection = () => {
  return (
    <section
      id="education"
      className="bg-neutral-800 px-8 py-24 border-t border-neutral-700"
    >
      <div className="max-w-7xl mx-auto w-full">
        <p className="text-teal-400 text-sm tracking-widest mb-4">
          ACADEMIC BACKGROUND
        </p>
        <h2 className="text-4xl font-bold text-white mb-12">Education</h2>

        <div className="space-y-10 max-w-4xl">
          {educationList.map((edu, index) => (
            <div
              key={index}
              className="relative bg-neutral-900/60 border border-neutral-700 rounded-2xl p-6 pl-10 hover:border-neutral-600 transition-all duration-300"
            >
              {/* Accent bar */}
              <div className="absolute left-0 top-6 bottom-6 w-1 bg-gradient-to-b from-teal-400 to-purple-500 rounded-full" />

              <h3 className="text-xl font-semibold text-white mb-1">
                {edu.degree}
              </h3>
              <p className="text-neutral-300 mb-2">{edu.institute}</p>
              <p className="text-neutral-500 text-sm">
                {edu.startYear} – {edu.endYear}
                {edu.cgpa && (
                  <span className="ml-3 text-teal-400 font-medium">
                    CGPA: {edu.cgpa}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
