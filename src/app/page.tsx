"use client";

import ContactSection from "./components/ContactSection";
import EducationSection from "./components/EducationSection";
import ExperienceSection from "./components/ExperienceSection";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import ProjectCard from "./components/ProjectCard";
import SkillsSection from "./components/SkillsSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-20 bg-neutral-900 text-gray-100">
        <Hero />

        {/* About */}
        <section
          id="about"
          className="bg-neutral-900 px-8 py-24 flex flex-col justify-center border-t border-neutral-800"
        >
          <div className="max-w-7xl mx-auto w-full">
            <p className="text-teal-400 text-sm tracking-widest mb-4">
              WHO I AM
            </p>
            <h2 className="text-4xl font-bold mb-6 text-white">About Me</h2>
            <p className="text-neutral-400 max-w-2xl text-lg leading-relaxed">
              I'm a passionate developer who loves building creative full-stack
              apps and learning new technologies. I thrive on solving complex
              problems and turning ideas into polished, production-ready
              products.
            </p>
          </div>
        </section>

        <SkillsSection />

        <ExperienceSection />

        {/* Projects */}
        <section
          id="projects"
          className="bg-neutral-900 px-8 py-24 border-t border-neutral-800"
        >
          <div className="max-w-7xl mx-auto">
            <p className="text-teal-400 text-sm tracking-widest mb-4">
              WHAT I'VE BUILT
            </p>
            <h2 className="text-4xl font-bold mb-4 text-white">Projects</h2>
            <p className="text-neutral-400 mb-12 max-w-2xl">
              A selection of real-world projects showcasing my full-stack
              development, system design, and AI integration skills.
            </p>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <ProjectCard
                title="Synk"
                description="Synk is a web based collaborative drawing tool"
                tech={["ExpressJs", "Docker", "Socket.io", "PostgreSQL", "GCP"]}
                github="https://github.com/patiladitya77/synk"
                live="https://dev-tinder-fe.onrender.com/"
                thumbnail="/projects/devtinder.png"
              />
              <ProjectCard
                title="Prep-AI"
                description="AI-powered interview preparation platform with resume analysis, mock interviews, and performance analytics."
                tech={["Next.js", "Node.js", "PostgreSQL", "Gemini", "BullMq"]}
                live="https://prep-ai-seven-rho.vercel.app/"
                github="https://github.com/patiladitya77/Prep-AI"
                thumbnail="/projects/prep-ai.png"
              />
              <ProjectCard
                title="LoveWall"
                description="LoveWall is a testimonial collection platform where workspace owners can gather video/text testimonials and embed them into their websites with auto-generated code."
                tech={["Next.js", "Redux", "Clerk", "Imagekit"]}
                github="https://github.com/patiladitya77/lovewall-web"
                thumbnail="/projects/lovewall.png"
              />
            </div>
          </div>
        </section>

        <EducationSection />
        <ContactSection />
      </main>
    </>
  );
}
