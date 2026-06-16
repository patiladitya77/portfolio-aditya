import ContactSection from "./components/ContactSection";
import EducationSection from "./components/EducationSection";
import ExperienceSection, { Experience } from "./components/ExperienceSection";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import ProjectCard from "./components/ProjectCard";
import SkillsSection from "./components/SkillsSection";

async function getData() {
  const base = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
  const [projectsRes, experiencesRes] = await Promise.all([
    fetch(`${base}/api/projects`, { cache: "no-store" }),
    fetch(`${base}/api/experiences`, { cache: "no-store" }),
  ]);

  const projects = projectsRes.ok ? await projectsRes.json() : [];
  const experiences = experiencesRes.ok ? await experiencesRes.json() : [];
  return { projects, experiences };
}

export default async function Home() {
  const { projects, experiences } = await getData();

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
              Software Engineer passionate about building scalable systems and
              solving complex problems at scale. Experienced in full-stack
              development with strong foundations in Data Structures,
              Algorithms, and Object Oriented Design. Proven ability to
              demonstrate ownership, curiosity, and collaborative mindset while
              delivering production-ready solutions in fast-paced environments.
            </p>
          </div>
        </section>

        <SkillsSection />

        <ExperienceSection experiences={experiences as Experience[]} />

        {/* Projects */}
        <section
          id="projects"
          className="bg-neutral-900 px-8 py-24 border-t border-neutral-800"
        >
          <div className="max-w-7xl mx-auto">
            <p className="text-teal-400 text-sm tracking-widest mb-4">
              WHAT I&apos;VE BUILT
            </p>
            <h2 className="text-4xl font-bold mb-4 text-white">Projects</h2>
            <p className="text-neutral-400 mb-12 max-w-2xl">
              A selection of real-world projects showcasing my full-stack
              development, system design, and AI integration skills.
            </p>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {projects.length === 0 && (
                <p className="text-neutral-500 col-span-3">No projects yet.</p>
              )}
              {projects.map(
                (p: {
                  _id: string;
                  title: string;
                  description: string;
                  technologies: string[];
                  github?: string;
                  live?: string;
                  thumbnail: string;
                }) => (
                  <ProjectCard
                    key={p._id}
                    title={p.title}
                    description={p.description}
                    tech={p.technologies}
                    github={p.github ?? undefined}
                    live={p.live ?? undefined}
                    thumbnail={p.thumbnail}
                  />
                ),
              )}
            </div>
          </div>
        </section>

        <EducationSection />
        <ContactSection />
      </main>
    </>
  );
}
