import { useState, useEffect } from "react";

/**
 * Pure helper function that returns true when the given width represents a mobile viewport
 * (i.e. width < 768 px).
 */
export function isMobileViewport(width: number): boolean {
  return width < 768;
}

/**
 * SSR-safe hook that returns true when window.innerWidth >= breakpoint.
 * On the server (no window object), always returns false.
 * Updates reactively when the window is resized.
 */
export function useMediaQuery(breakpoint: number): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    // SSR-safe: return false when window is not available
    if (typeof window === "undefined") return false;
    return window.innerWidth >= breakpoint;
  });

  useEffect(() => {
    // If window is unavailable (SSR context), do nothing
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setMatches(window.innerWidth >= breakpoint);
    };

    // Sync immediately in case the value changed between render and effect
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpoint]);

  return matches;
}
