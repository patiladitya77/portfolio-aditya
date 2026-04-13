"use client";

import React, { useState, useEffect } from "react";
import { Play, Github, ExternalLink } from "lucide-react";

type ProjectCardProps = {
  title: string;
  description: string;
  tech: string[];
  live?: string;
  github?: string;
  thumbnail?: string;
};

const ProjectCard = ({
  title,
  description,
  tech,
  live,
  github,
  thumbnail,
}: ProjectCardProps) => {
  const [showTerminal, setShowTerminal] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);

  const deploymentLogs = [
    "🚀 Initializing deployment...",
    "📦 Installing dependencies...",
    "✓ Dependencies installed successfully",
    "📝 Generating static pages...",
    "✓ Static pages generated",
    "🎨 Optimizing assets...",
    "✓ Assets optimized",
    "🔍 Running production build...",
    "✓ Build completed successfully",
    "🌐 Deploying to production...",
    "✓ Deployment successful!",
    "🎉 Application is live!",
    "🔗 Redirecting to live site...",
  ];

  useEffect(() => {
    if (showTerminal && currentLogIndex < deploymentLogs.length) {
      const timer = setTimeout(() => {
        setLogs((prev) => [...prev, deploymentLogs[currentLogIndex]]);
        setCurrentLogIndex((prev) => prev + 1);
      }, 500);
      return () => clearTimeout(timer);
    } else if (showTerminal && currentLogIndex === deploymentLogs.length) {
      const redirectTimer = setTimeout(() => {
        if (live) {
          window.open(live, "_blank");
          setShowTerminal(false);
          setLogs([]);
          setCurrentLogIndex(0);
        }
      }, 1500);
      return () => clearTimeout(redirectTimer);
    }
  }, [showTerminal, currentLogIndex, live]);

  const handlePlayClick = () => {
    if (live) {
      setShowTerminal(true);
      setLogs([]);
      setCurrentLogIndex(0);
    }
  };

  return (
    <div className="group relative bg-neutral-800 border border-neutral-700 rounded-2xl overflow-hidden hover:border-neutral-600 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col h-full">
      {/* Thumbnail Section — fixed height */}
      <div className="relative h-48 shrink-0 bg-linear-to-br from-neutral-700 to-neutral-800 overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl font-bold text-neutral-600 opacity-50">
              {title.charAt(0)}
            </div>
          </div>
        )}

        {live && (
          <button
            onClick={handlePlayClick}
            className="absolute top-4 right-4 w-12 h-12 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-lg hover:shadow-green-500/50 transition-all duration-300 hover:scale-110 z-10"
            aria-label="Deploy and view live"
          >
            <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
          </button>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-neutral-800 via-transparent to-transparent opacity-60" />
      </div>

      {/* Content Section — grows to fill card, flex column */}
      <div className="p-6 flex flex-col flex-1">
        {/* Title — fixed position at top */}
        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
          {title}
        </h3>

        {/* Description — fixed height with line clamp so it never reflows layout */}
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
          {description}
        </p>

        {/* Tech Stack — fixed min-height so badges don't shift buttons */}
        <div className="flex flex-wrap gap-2 min-h-14 content-start mb-6">
          {tech.map((t) => (
            <span
              key={t}
              className="px-3 py-1 text-xs bg-neutral-700 text-gray-300 rounded-full border border-neutral-600 hover:border-green-500/50 transition-colors h-fit"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Links — always pinned to bottom */}
        <div className="flex gap-3 mt-auto pt-4 border-t border-neutral-700/50">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm border border-neutral-600 rounded-full hover:bg-neutral-700 hover:border-neutral-500 transition-all"
            >
              <Github className="w-4 h-4" />
              Code
            </a>
          )}
          {live && (
            <a
              href={live}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm bg-green-500/10 border border-green-500/30 text-green-400 rounded-full hover:bg-green-500/20 hover:border-green-500/50 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              Live
            </a>
          )}
        </div>
      </div>

      {/* Terminal Overlay */}
      {showTerminal && (
        <div className="absolute inset-0 bg-black/95 backdrop-blur-sm z-20 flex flex-col p-6 animate-in fade-in duration-300">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-700">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-sm text-gray-400 ml-2 font-mono">
              deployment-logs
            </span>
          </div>

          <div className="flex-1 overflow-auto font-mono text-sm space-y-2">
            {logs.map((log, index) => (
              <div
                key={index}
                className="text-green-400 animate-in fade-in slide-in-from-left-2 duration-200"
              >
                <span className="text-gray-500">$ </span>
                {log}
              </div>
            ))}
            {currentLogIndex < deploymentLogs.length && (
              <div className="flex items-center gap-2 text-green-400">
                <span className="text-gray-500">$ </span>
                <div className="w-2 h-4 bg-green-400 animate-pulse" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
