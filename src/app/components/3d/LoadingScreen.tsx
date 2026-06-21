"use client";

import { motion, AnimatePresence } from "framer-motion";

/**
 * LoadingScreen — full-screen DOM overlay rendered as the <Suspense> fallback
 * inside RoomView. Fades out in ≤ 600 ms via framer-motion AnimatePresence
 * once Suspense resolves.
 *
 * Requirements: 1.2, 1.3
 */
export default function LoadingScreen() {
  return (
    <AnimatePresence>
      <motion.div
        key="loading-screen"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(10, 10, 20, 0.97)",
          color: "#a0aec0",
        }}
        data-testid="loading-screen"
      >
        {/* Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "4px solid rgba(100, 100, 255, 0.2)",
            borderTopColor: "#6366f1",
            marginBottom: 24,
          }}
          data-testid="loading-spinner"
        />
        <p
          style={{
            fontSize: 14,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Loading room…
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
