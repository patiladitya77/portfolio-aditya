"use client";

import { useState } from "react";
import AddProjectForm from "./AddProjectForm";
import AddExperienceForm from "./AddExperienceForm";
import ProjectsManager from "./ProjectsManager";

const TABS = ["Projects", "Experience"] as const;
type Tab = (typeof TABS)[number];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("Projects");

  return (
    <main className="min-h-screen bg-neutral-900 text-gray-100 px-8 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-neutral-400 mb-8">Manage your portfolio content.</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-neutral-700">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-teal-500 text-teal-400"
                  : "border-transparent text-neutral-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
          {activeTab === "Projects" && <ProjectsManager />}
          {activeTab === "Experience" && <AddExperienceForm />}
        </div>
      </div>
    </main>
  );
}
