import React from "react";
type ProjectCardProps = {
  title: string;
  description: string;
  tech: string[];
  live?: string;
  github?: string;
};
const ProjectCard = ({
  title,
  description,
  tech,
  live,
  github,
}: ProjectCardProps) => {
  return (
    <div className="bg-black border border-white/10 rounded-xl p-6 hover:border-white/30 transition">
      <h3 className="text-2xl font-semibold text-white mb-3">{title}</h3>

      <p className="text-gray-400 mb-4">{description}</p>

      {/* Tech stack */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tech.map((t) => (
          <span key={t} className="px-3 py-1 text-sm bg-white/10 rounded-full">
            {t}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="flex gap-4">
        {live && (
          <a
            href={live}
            target="_blank"
            className="px-4 py-2 text-sm border border-white rounded-full hover:bg-white hover:text-black transition"
          >
            Live
          </a>
        )}
        {github && (
          <a
            href={github}
            target="_blank"
            className="px-4 py-2 text-sm border border-white rounded-full hover:bg-white hover:text-black transition"
          >
            GitHub
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
