"use client";

import { useEffect } from "react";
import { useRoomStore } from "./hooks/useRoomStore";

/**
 * BackButton — DOM button overlay visible only when a FocusState is active.
 *
 * - Reads `focusTarget` from the Zustand store.
 * - Renders a fixed, top-left button when `focusTarget !== null`.
 * - On click, calls `store.clearFocus()`.
 * - Registers a global `keydown` listener for Escape that also calls `store.clearFocus()`.
 *
 * Requirements: 10.1, 10.2, 10.4
 */
export default function BackButton() {
  const focusTarget = useRoomStore((s) => s.focusTarget);
  const clearFocus = useRoomStore((s) => s.clearFocus);

  // Escape key handler
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        clearFocus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [clearFocus]);

  if (focusTarget === null) {
    return null;
  }

  return (
    <button
      onClick={clearFocus}
      aria-label="Back to room overview"
      data-testid="back-button"
      style={{
        position: "fixed",
        top: 20,
        left: 20,
        zIndex: 45,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 16px",
        background: "rgba(10, 10, 30, 0.75)",
        color: "#e2e8f0",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        borderRadius: 8,
        fontSize: 14,
        cursor: "pointer",
        backdropFilter: "blur(6px)",
        transition: "background 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background =
          "rgba(30, 30, 60, 0.9)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background =
          "rgba(10, 10, 30, 0.75)";
      }}
    >
      {/* Left-pointing chevron */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M10 12L6 8l4-4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Back
    </button>
  );
}
