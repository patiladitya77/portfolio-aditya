"use client";

import { Mail, Phone, MapPin, Github, Linkedin } from "lucide-react";

const ContactSection = () => {
  return (
    <section
      id="contact"
      className="bg-neutral-900 px-6 py-24 border-t border-neutral-800"
    >
      <div className="max-w-7xl mx-auto w-full">
        <p className="text-teal-400 text-sm tracking-widest mb-4">
          GET IN TOUCH
        </p>
        <h2 className="text-4xl font-bold text-white mb-12">Contact Me</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* LEFT - Contact Form */}
          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-10">
            <h3 className="text-xl font-semibold text-white mb-2">
              Got a question or{" "}
              <span className="text-teal-400">want to work together?</span>
            </h3>
            <p className="text-neutral-400 mb-8">Feel free to reach out</p>

            <div className="space-y-6">
              <div>
                <label className="text-neutral-300 text-sm mb-2 block">
                  Your Name
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-4 py-3 text-white focus:outline-none focus:border-teal-400 transition-colors"
                />
              </div>

              <div>
                <label className="text-neutral-300 text-sm mb-2 block">
                  Your Email
                </label>
                <input
                  type="email"
                  className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-4 py-3 text-white focus:outline-none focus:border-teal-400 transition-colors"
                />
              </div>

              <div>
                <label className="text-neutral-300 text-sm mb-2 block">
                  Your Message
                </label>
                <textarea
                  rows={5}
                  className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-4 py-3 text-white resize-none focus:outline-none focus:border-teal-400 transition-colors"
                />
              </div>

              <button
                type="button"
                className="mt-4 inline-flex items-center gap-2 px-8 py-3 rounded-full bg-linear-to-r from-teal-400 to-purple-500 text-black font-semibold hover:scale-105 transition"
              >
                SEND MESSAGE <Mail size={18} />
              </button>
            </div>
          </div>

          {/* RIGHT - Contact Info */}
          <div className="flex flex-col justify-center gap-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-neutral-800 border border-neutral-700 text-teal-400">
                <Mail size={20} />
              </div>
              <span className="text-neutral-300">adpatil587@gmail.com</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-neutral-800 border border-neutral-700 text-teal-400">
                <Phone size={20} />
              </div>
              <span className="text-neutral-300">+91 9321760793</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-neutral-800 border border-neutral-700 text-teal-400">
                <MapPin size={20} />
              </div>
              <span className="text-neutral-300">
                Mumbai, Maharashtra, India
              </span>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4 mt-4">
              <a
                href="https://github.com/patiladitya77"
                target="_blank"
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-neutral-800 border border-neutral-700 hover:border-teal-400 hover:text-teal-400 transition-all duration-200"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/devwithaditya/"
                target="_blank"
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-neutral-800 border border-neutral-700 hover:border-teal-400 hover:text-teal-400 transition-all duration-200"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
