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
    cgpa: 9.025,
  },
];

const EducationSection = () => {
  return (
    <section
      id="education"
      className="min-h-screen flex flex-col justify-center px-8 py-24 bg-neutral-950"
    >
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-4xl font-bold text-white mb-12">Education</h2>

        <div className="space-y-10">
          {educationList.map((edu, index) => (
            <div
              key={index}
              className="border-l-2 border-neutral-800 pl-6 relative"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[7px] top-2 w-3 h-3 bg-white rounded-full" />

              <h3 className="text-xl font-semibold text-white">{edu.degree}</h3>

              <p className="text-neutral-300">{edu.institute}</p>

              <p className="text-neutral-500 text-sm">
                {edu.startYear} – {edu.endYear}
                {edu.cgpa && (
                  <span className="ml-2">
                    · CGPA:{" "}
                    <span className="text-neutral-300 font-medium">
                      {edu.cgpa}
                    </span>
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
