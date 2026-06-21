"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, FileText } from "lucide-react"; // Github/Linkedin deprecated hints are cosmetic — no TS errors

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContactFormState {
  name: string;
  email: string;
  message: string;
  errors: Partial<Record<"name" | "email" | "message", string>>;
  submitted: boolean;
}

// ─── Pure validation (exported for testability / PBT) ─────────────────────────

export function validateContactForm(fields: {
  name: string;
  email: string;
  message: string;
}): {
  valid: boolean;
  errors: Partial<Record<"name" | "email" | "message", string>>;
} {
  const errors: Partial<Record<"name" | "email" | "message", string>> = {};

  if (fields.name.trim() === "") {
    errors.name = "Name is required.";
  }

  if (fields.email.trim() === "" || !fields.email.includes("@")) {
    errors.email = "A valid email address is required.";
  }

  if (fields.message.trim() === "") {
    errors.message = "Message is required.";
  }

  const valid = Object.keys(errors).length === 0;
  return { valid, errors };
}

// ─── Contact info ─────────────────────────────────────────────────────────────

const contactLinks = [
  {
    label: "adpatil587@gmail.com",
    href: "mailto:adpatil587@gmail.com",
    icon: Mail,
    isDownload: false,
  },
  {
    label: "GitHub",
    href: "https://github.com/patiladitya77",
    icon: Github,
    isDownload: false,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/devwithaditya/",
    icon: Linkedin,
    isDownload: false,
  },
  {
    label: "Download Résumé",
    href: "https://drive.google.com/file/d/1uerRn9Py_JacfZU-DR2CTHfhgtlqkqDd/view?usp=sharing",
    icon: FileText,
    isDownload: true,
  },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function ContactPanel() {
  const [form, setForm] = useState<ContactFormState>({
    name: "",
    email: "",
    message: "",
    errors: {},
    submitted: false,
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      // Clear the individual field error as the user edits it
      errors: { ...prev.errors, [name]: undefined },
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { valid, errors } = validateContactForm({
      name: form.name,
      email: form.email,
      message: form.message,
    });

    if (!valid) {
      // Preserve existing field values — only update errors
      setForm((prev) => ({ ...prev, errors }));
      return;
    }

    setForm((prev) => ({ ...prev, errors: {}, submitted: true }));
  }

  return (
    <div
      data-testid="contact-panel"
      className="w-full max-w-[600px] mx-auto rounded-2xl overflow-y-auto"
      style={{
        background: "rgba(5, 5, 20, 0.92)",
        maxHeight: "85vh",
      }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-neutral-700/50">
        <h2 className="text-2xl font-bold text-white">Contact</h2>
        <p className="text-neutral-400 text-sm mt-1">
          Let&apos;s work together
        </p>
      </div>

      <div className="p-6 space-y-8">
        {/* ── Contact icon row ── */}
        <div className="flex flex-wrap gap-4">
          {contactLinks.map(
            ({ label, href, icon: Icon, isDownload }, index) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                download={isDownload || undefined}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-700 bg-neutral-800/60 text-neutral-300 hover:border-teal-400 hover:text-teal-400 transition-all duration-200 text-sm"
              >
                <Icon size={16} aria-hidden="true" />
                <span>{label}</span>
              </motion.a>
            ),
          )}
        </div>

        {/* ── Contact form or success message ── */}
        {form.submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-teal-500/40 bg-teal-500/10 px-6 py-8 text-center"
          >
            <p className="text-teal-300 text-lg font-semibold">
              Thanks! I&apos;ll get back to you soon.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="contact-name"
                className="block text-neutral-300 text-sm mb-1.5"
              >
                Your Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                aria-describedby={form.errors.name ? "error-name" : undefined}
                aria-invalid={!!form.errors.name}
                className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-4 py-2.5 text-white text-sm focus:outline-none focus:border-teal-400 transition-colors"
              />
              {form.errors.name && (
                <p
                  id="error-name"
                  role="alert"
                  className="mt-1 text-red-400 text-xs"
                >
                  {form.errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="contact-email"
                className="block text-neutral-300 text-sm mb-1.5"
              >
                Your Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                aria-describedby={form.errors.email ? "error-email" : undefined}
                aria-invalid={!!form.errors.email}
                className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-4 py-2.5 text-white text-sm focus:outline-none focus:border-teal-400 transition-colors"
              />
              {form.errors.email && (
                <p
                  id="error-email"
                  role="alert"
                  className="mt-1 text-red-400 text-xs"
                >
                  {form.errors.email}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="contact-message"
                className="block text-neutral-300 text-sm mb-1.5"
              >
                Your Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                aria-describedby={
                  form.errors.message ? "error-message" : undefined
                }
                aria-invalid={!!form.errors.message}
                className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-4 py-2.5 text-white text-sm resize-none focus:outline-none focus:border-teal-400 transition-colors"
              />
              {form.errors.message && (
                <p
                  id="error-message"
                  role="alert"
                  className="mt-1 text-red-400 text-xs"
                >
                  {form.errors.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-linear-to-r from-teal-400 to-purple-500 text-black font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
