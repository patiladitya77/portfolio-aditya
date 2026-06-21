"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";

interface ProjectDTO {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  github?: string;
  live?: string;
  thumbnail: string;
}

export default function ProjectsPanel() {
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data: ProjectDTO[]) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <div
      className="w-full max-w-3xl mx-auto rounded-2xl overflow-y-auto"
      style={{
        background: "rgba(5, 5, 20, 0.92)",
        maxHeight: "80vh",
      }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-neutral-700/50">
        <h2 className="text-2xl font-bold text-white">Projects</h2>
        <p className="text-neutral-400 text-sm mt-1">Things I&apos;ve built</p>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <span className="text-neutral-400 text-sm">
              Loading projects...
            </span>
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center justify-center py-16">
            <span className="text-red-400 text-sm">
              Couldn&apos;t load projects — please try again.
            </span>
          </div>
        )}

        {!loading && !error && (
          <div className="flex flex-col gap-4">
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                data-testid="project-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                className="bg-neutral-800 border border-neutral-700 rounded-xl p-5 hover:border-neutral-600 transition-colors"
              >
                {/* Title row */}
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-lg font-semibold text-white leading-snug">
                    {project.title}
                  </h3>
                  {/* Initial letter avatar */}
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-neutral-700 flex items-center justify-center text-neutral-400 font-bold text-lg">
                    {project.title.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Description */}
                <p className="text-neutral-400 text-sm leading-relaxed mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Tech badges */}
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 text-xs bg-neutral-700 text-neutral-300 rounded-full border border-neutral-600"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links */}
                {(project.github || project.live) && (
                  <div className="flex gap-3 pt-3 border-t border-neutral-700/50">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white transition-colors"
                        aria-label={`GitHub repository for ${project.title}`}
                      >
                        <Github className="w-3.5 h-3.5" />
                        GitHub
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300 transition-colors"
                        aria-label={`Live demo for ${project.title}`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Live Demo
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
