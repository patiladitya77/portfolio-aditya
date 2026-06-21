"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRoomStore, FocusTarget } from "../hooks/useRoomStore";
import ProjectsPanel from "./ProjectsPanel";
import SkillsPanel from "./SkillsPanel";
import ExperiencePanel from "./ExperiencePanel";
import AboutPanel from "./AboutPanel";
import ContactPanel from "./ContactPanel";
import MonitorPanel from "./MonitorPanel";

// ---------------------------------------------------------------------------
// Inline decorative panels for coffee mug and sticky notes
// ---------------------------------------------------------------------------

function CoffeePanel() {
  return (
    <div
      style={{
        background: "rgba(10, 10, 30, 0.85)",
        color: "#e2e8f0",
        padding: "16px 28px",
        borderRadius: 12,
        fontSize: 15,
        letterSpacing: "0.03em",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        textAlign: "center",
        whiteSpace: "nowrap",
      }}
    >
      Building Projects ☕ | Open to Opportunities
    </div>
  );
}

function StickyPanel() {
  const facts = [
    "💡 Clean code is its own documentation.",
    "🚀 Ship early, iterate often.",
    "🧠 Learning never stops in this field.",
    "🔍 Debug by understanding, not by guessing.",
    "⚡ Performance matters — profile before optimizing.",
  ];

  return (
    <div
      style={{
        background: "rgba(255, 235, 100, 0.92)",
        color: "#1a1a1a",
        padding: "20px 24px",
        borderRadius: 4,
        fontSize: 13,
        fontFamily: "monospace",
        backdropFilter: "blur(4px)",
        border: "1px solid rgba(0, 0, 0, 0.12)",
        boxShadow: "2px 4px 12px rgba(0,0,0,0.25)",
        maxWidth: 280,
        lineHeight: 1.6,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 14 }}>
        📌 Dev Notes
      </div>
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        {facts.map((fact, i) => (
          <li key={i} style={{ marginBottom: 6 }}>
            {fact}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PANEL_MAP — exported for testability
// ---------------------------------------------------------------------------

export const PANEL_MAP: Record<FocusTarget, React.ComponentType> = {
  laptop: ProjectsPanel,
  bookshelf: SkillsPanel,
  whiteboard: ExperiencePanel,
  window: AboutPanel,
  smartphone: ContactPanel,
  monitor: MonitorPanel,
  coffee: CoffeePanel,
  sticky: StickyPanel,
};

// ---------------------------------------------------------------------------
// ContentPanelHost
// ---------------------------------------------------------------------------

/**
 * ContentPanelHost — DOM overlay that renders the active content panel.
 *
 * - Positioned fixed at inset:0 with pointerEvents:none so it sits over the
 *   canvas without blocking scene interactions by default.
 * - Reads `focusTarget` and `isAnimating` from the Zustand room store.
 * - Shows the matching panel only after the camera animation finishes
 *   (`isAnimating === false`).
 * - Wraps the panel in framer-motion AnimatePresence for fade transitions.
 * - Panel wrapper has `data-panel={focusKey}` for testability.
 *
 * Requirements: 9.1, 9.2, 9.3, 9.4
 */
export default function ContentPanelHost() {
  const focusTarget = useRoomStore((s) => s.focusTarget);
  const isAnimating = useRoomStore((s) => s.isAnimating);

  // Determine whether to show a panel
  const showPanel = focusTarget !== null && !isAnimating;
  const focusKey = showPanel ? focusTarget : null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      <AnimatePresence>
        {showPanel &&
          focusKey !== null &&
          (() => {
            const PanelComponent = PANEL_MAP[focusKey];
            return (
              <motion.div
                key={focusKey}
                data-panel={focusKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "auto",
                }}
              >
                <PanelComponent />
              </motion.div>
            );
          })()}
      </AnimatePresence>
    </div>
  );
}
