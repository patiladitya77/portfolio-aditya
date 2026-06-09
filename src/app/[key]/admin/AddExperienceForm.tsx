"use client";

import { useState } from "react";

export default function AddExperienceForm() {
  const [form, setForm] = useState({
    role: "",
    company: "",
    workLocation: "",
    startDate: "",
    endDate: "",
    description: "",
    isCurrent: false,
    skills: "",
    order: 0,
    isVisible: true,
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await fetch("/api/admin/addexperience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        order: Number(form.order),
        description: form.description
          .split("\n")
          .map((d) => d.trim())
          .filter(Boolean),
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        endDate: form.isCurrent ? null : form.endDate,
      }),
    });

    setLoading(false);
    if (res.ok) {
      setMessage({ type: "success", text: "Experience added successfully." });
      setForm({
        role: "",
        company: "",
        workLocation: "",
        startDate: "",
        endDate: "",
        description: "",
        isCurrent: false,
        skills: "",
        order: 0,
        isVisible: true,
      });
    } else {
      const data = await res.json();
      setMessage({
        type: "error",
        text: data.error || "Failed to add experience.",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field
        label="Role *"
        name="role"
        value={form.role}
        onChange={handleChange}
        required
      />
      <Field
        label="Company *"
        name="company"
        value={form.company}
        onChange={handleChange}
        required
      />
      <Field
        label="Work Location *"
        name="workLocation"
        value={form.workLocation}
        onChange={handleChange}
        required
        placeholder="Remote / On-site / Hybrid"
      />
      <Field
        label="Start Date * (YYYY-MM)"
        name="startDate"
        value={form.startDate}
        onChange={handleChange}
        required
        placeholder="2024-01"
      />

      <label className="flex items-center gap-2 text-sm text-neutral-300">
        <input
          type="checkbox"
          name="isCurrent"
          checked={form.isCurrent}
          onChange={handleChange}
          className="accent-teal-500"
        />
        Currently working here
      </label>

      {!form.isCurrent && (
        <Field
          label="End Date (YYYY-MM)"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          placeholder="2024-12"
        />
      )}

      <Field
        label="Description * (one bullet per line)"
        name="description"
        value={form.description}
        onChange={handleChange}
        required
        textarea
        placeholder={"Built REST APIs with Node.js\nReduced latency by 30%"}
      />
      <Field
        label="Skills (comma separated)"
        name="skills"
        value={form.skills}
        onChange={handleChange}
        placeholder="React, TypeScript, AWS"
      />
      <Field
        label="Order"
        name="order"
        value={String(form.order)}
        onChange={handleChange}
        type="number"
      />

      <label className="flex items-center gap-2 text-sm text-neutral-300">
        <input
          type="checkbox"
          name="isVisible"
          checked={form.isVisible}
          onChange={handleChange}
          className="accent-teal-500"
        />
        Visible
      </label>

      {message && (
        <p
          className={`text-sm ${message.type === "success" ? "text-teal-400" : "text-red-400"}`}
        >
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-white font-semibold rounded-lg px-4 py-3 transition"
      >
        {loading ? "Adding..." : "Add Experience"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  required,
  textarea,
  placeholder,
  type,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: any) => void;
  required?: boolean;
  textarea?: boolean;
  placeholder?: string;
  type?: string;
}) {
  const cls =
    "w-full bg-neutral-700 text-white placeholder-neutral-400 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500 transition";
  return (
    <div>
      <label className="text-xs text-neutral-400 mb-1 block">{label}</label>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          rows={4}
          className={cls}
        />
      ) : (
        <input
          type={type || "text"}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={cls}
        />
      )}
    </div>
  );
}
