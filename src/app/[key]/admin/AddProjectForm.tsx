"use client";

import { useState } from "react";

const CATEGORIES = [
  "Full-Stack",
  "Frontend",
  "Backend",
  "AI",
  "DevOps",
  "Mobile",
  "Other",
];
const STATUSES = ["completed", "in-progress", "planned"];

export default function AddProjectForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    longDescription: "",
    technologies: "",
    github: "",
    live: "",
    thumbnail: "",
    order: 0,
    isFeatured: false,
    isVisible: true,
    category: "Full-Stack",
    status: "completed",
  });
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!form.title.trim()) {
      setMessage({
        type: "error",
        text: "Enter the project title before uploading a thumbnail.",
      });
      e.target.value = "";
      return;
    }
    setMessage(null);
    setUploading(true);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("name", form.title.trim());

    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    setUploading(false);

    if (res.ok) {
      const data = await res.json();
      setForm((prev) => ({ ...prev, thumbnail: data.path }));
      setThumbnailPreview(data.path);
    } else {
      const data = await res.json();
      setMessage({ type: "error", text: data.error || "Upload failed." });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.thumbnail) {
      setMessage({ type: "error", text: "Please upload a thumbnail image." });
      return;
    }
    setLoading(true);
    setMessage(null);

    const res = await fetch("/api/admin/addproject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        order: Number(form.order),
        technologies: form.technologies
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }),
    });

    setLoading(false);
    if (res.ok) {
      setMessage({ type: "success", text: "Project added successfully." });
      setForm({
        title: "",
        description: "",
        longDescription: "",
        technologies: "",
        github: "",
        live: "",
        thumbnail: "",
        order: 0,
        isFeatured: false,
        isVisible: true,
        category: "Full-Stack",
        status: "completed",
      });
      setThumbnailPreview(null);
    } else {
      const data = await res.json();
      setMessage({
        type: "error",
        text: data.error || "Failed to add project.",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field
        label="Title *"
        name="title"
        value={form.title}
        onChange={handleChange}
        required
      />
      <Field
        label="Short Description * (max 200 chars)"
        name="description"
        value={form.description}
        onChange={handleChange}
        required
        textarea
        maxLength={200}
      />
      <Field
        label="Long Description"
        name="longDescription"
        value={form.longDescription}
        onChange={handleChange}
        textarea
      />
      <Field
        label="Technologies * (comma separated)"
        name="technologies"
        value={form.technologies}
        onChange={handleChange}
        required
        placeholder="React, Node.js, MongoDB"
      />

      {/* Thumbnail upload */}
      <div>
        <label className="text-xs text-neutral-400 mb-1 block">
          Thumbnail * (upload image)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange}
          className="w-full text-sm text-neutral-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-teal-600 file:text-white hover:file:bg-teal-500 transition cursor-pointer"
        />
        {uploading && (
          <p className="text-xs text-neutral-400 mt-1">Uploading...</p>
        )}
        {thumbnailPreview && (
          <img
            src={thumbnailPreview}
            alt="Thumbnail preview"
            className="mt-3 h-32 w-full object-cover rounded-lg border border-neutral-600"
          />
        )}
      </div>

      <Field
        label="GitHub URL"
        name="github"
        value={form.github}
        onChange={handleChange}
        placeholder="https://github.com/..."
      />
      <Field
        label="Live URL"
        name="live"
        value={form.live}
        onChange={handleChange}
        placeholder="https://..."
      />
      <Field
        label="Order"
        name="order"
        value={String(form.order)}
        onChange={handleChange}
        type="number"
      />

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-neutral-300">
          <input
            type="checkbox"
            name="isFeatured"
            checked={form.isFeatured}
            onChange={handleChange}
            className="accent-teal-500"
          />
          Featured
        </label>
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
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-xs text-neutral-400 mb-1 block">
            Category
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full bg-neutral-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="text-xs text-neutral-400 mb-1 block">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full bg-neutral-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
          >
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {message && (
        <p
          className={`text-sm ${message.type === "success" ? "text-teal-400" : "text-red-400"}`}
        >
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || uploading}
        className="bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-white font-semibold rounded-lg px-4 py-3 transition"
      >
        {loading ? "Adding..." : "Add Project"}
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
  maxLength,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: any) => void;
  required?: boolean;
  textarea?: boolean;
  placeholder?: string;
  type?: string;
  maxLength?: number;
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
          maxLength={maxLength}
          rows={3}
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
