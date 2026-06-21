"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SESSION_KEY = "hint-dismissed";

/**
 * Returns whether the hint has already been dismissed in this session.
 * Exposed for testing purposes.
 */
export function isHintDismissed(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_KEY) === "true";
}

/**
 * Marks the hint as dismissed in sessionStorage.
 * Exposed for testing purposes.
 */
export function persistHintDismissed(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, "true");
}

/**
 * HintOverlay — brief on-screen prompt for first-time visitors.
 *
 * - On mount, checks sessionStorage. If already dismissed, renders nothing.
 * - Renders instruction text: "Click objects in the room to explore".
 * - Dismisses on click anywhere in the overlay, or after 5 s timeout.
 * - On dismiss, writes sessionStorage flag and fades out in 400 ms.
 *
 * Requirements: 11.1, 11.2, 11.3, 11.4
 */
export default function HintOverlay() {
  // undefined = not yet checked (SSR / initial render)
  const [visible, setVisible] = useState<boolean | undefined>(undefined);

  // Check sessionStorage on mount (client only)
  useEffect(() => {
    if (isHintDismissed()) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, []);

  const dismiss = useCallback(() => {
    persistHintDismissed();
    setVisible(false);
  }, []);

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (visible !== true) return;
    const id = setTimeout(dismiss, 5000);
    return () => clearTimeout(id);
  }, [visible, dismiss]);

  // Not yet mounted on client — render nothing to avoid hydration mismatch
  if (visible === undefined || visible === false) {
    return (
      <AnimatePresence>
        {/* AnimatePresence needs to observe the exit of the motion.div;
            when visible is false the child is not rendered, triggering exit. */}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="hint-overlay"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          onClick={dismiss}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: 48,
            cursor: "pointer",
            pointerEvents: "none", // pass clicks through to the scene
          }}
          data-testid="hint-overlay"
        >
          <motion.div
            style={{
              background: "rgba(0, 0, 0, 0.65)",
              color: "#e2e8f0",
              padding: "12px 28px",
              borderRadius: 8,
              fontSize: 14,
              letterSpacing: "0.04em",
              pointerEvents: "auto",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
            data-testid="hint-message"
          >
            Click objects in the room to explore
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
