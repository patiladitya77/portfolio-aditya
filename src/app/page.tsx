import Hero from "./components/Hero";
import Navbar from "./components/Navbar";

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

        <section
          id="skills"
          className="min-h-screen flex flex-col justify-center px-8 bg-neutral-950"
        >
          <h2 className="text-4xl font-bold mb-4 text-white">Skills</h2>
          <p className="text-gray-400">
            React, Node.js, TypeScript, MongoDB, AWS, Next.js
          </p>
        </section>

        <section
          id="experience"
          className="min-h-screen flex flex-col justify-center px-8"
        >
          <h2 className="text-4xl font-bold mb-4 text-white">Experience</h2>
          <p className="text-gray-400">
            Built multiple real-world projects using modern web technologies.
          </p>
        </section>

        <section
          id="projects"
          className="min-h-screen flex flex-col justify-center px-8 bg-neutral-950"
        >
          <h2 className="text-4xl font-bold mb-4 text-white">Projects</h2>
          <p className="text-gray-400">
            NetflixGPT, DevTinder, Submyt, AI Interview Mastery App
          </p>
        </section>

        <section
          id="education"
          className="min-h-screen flex flex-col justify-center px-8"
        >
          <h2 className="text-4xl font-bold mb-4 text-white">Education</h2>
          <p className="text-gray-400">
            B.E. in Information Technology — Mumbai University
          </p>
        </section>

        <section
          id="contact"
          className="min-h-screen flex flex-col justify-center px-8 bg-neutral-950"
        >
          <h2 className="text-4xl font-bold mb-4 text-white">Contact</h2>
          <p className="text-gray-400">aditya@example.com</p>
        </section>
      </main>
    </>
  );
}
