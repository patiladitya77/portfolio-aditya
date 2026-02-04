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

      <main className="pt-20 space-y-32 bg-black text-gray-100">
        <Hero />
        <section
          id="about"
          className="min-h-screen flex flex-col justify-center px-8"
        >
          <h2 className="text-4xl font-bold mb-4 text-white">About Me</h2>
          <p className="text-gray-400 max-w-2xl">
            I’m a passionate developer who loves building creative full-stack
            apps and learning new technologies.
          </p>
        </section>

        <SkillsSection />

        <ExperienceSection />

        <section
          id="projects"
          className="min-h-screen px-8 bg-neutral-950 py-24"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-4 text-white">Projects</h2>

            <p className="text-gray-400 mb-12 max-w-2xl">
              A selection of real-world projects showcasing my full-stack
              development, system design, and AI integration skills.
            </p>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <ProjectCard
                title="Prep-AI"
                description="AI-powered interview preparation platform with resume analysis, mock interviews, and performance analytics."
                tech={["Next.js", "Node.js", "POstgewsql", "Gemini", "BullMq"]}
                live="https://prep-ai-seven-rho.vercel.app/"
                github="https://github.com/patiladitya77/Prep-AI"
              />

              <ProjectCard
                title="LoveWall"
                description="LoveWall is a testimonial collection platform where workspace owners can gather video/text testimonials and embed them into their websites with auto-generated code."
                tech={["Next.Js", "Redux", "Clerk", "Imagekit"]}
                github="https://github.com/patiladitya77/lovewall-web"
              />

              <ProjectCard
                title="DevTinder"
                description="Developer networking platform with matchmaking logic and real-time interactions."
                tech={["MERN", "JWT", "Socket.io"]}
                github="https://github.com/patiladitya77/Dev-Tinder-FE"
                live="https://dev-tinder-fe.onrender.com/login"
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
