/**
 * Unit tests for HintOverlay
 * Requirements: 11.3, 11.4
 */

import { jest } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import HintOverlay, {
  isHintDismissed,
  persistHintDismissed,
} from "../HintOverlay";

// framer-motion: suppress animation side-effects in JSDOM
jest.mock("framer-motion", () => {
  const React = require("react");
  const AnimatePresence = ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children);
  const motion = {
    div: React.forwardRef(
      (
        {
          children,
          ...rest
        }: React.HTMLAttributes<HTMLDivElement> & { [key: string]: unknown },
        ref: React.Ref<HTMLDivElement>,
      ) => React.createElement("div", { ...rest, ref }, children),
    ),
  };
  return { AnimatePresence, motion };
});

describe("HintOverlay", () => {
  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders the hint message on first mount (no sessionStorage flag)", async () => {
    await act(async () => {
      render(<HintOverlay />);
    });

    expect(
      screen.getByText("Click objects in the room to explore"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("hint-overlay")).toBeInTheDocument();
  });

  it("does NOT render when sessionStorage flag is already set", async () => {
    sessionStorage.setItem("hint-dismissed", "true");

    await act(async () => {
      render(<HintOverlay />);
    });

    expect(
      screen.queryByText("Click objects in the room to explore"),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("hint-overlay")).not.toBeInTheDocument();
  });

  it("writes sessionStorage flag when dismissed by click", async () => {
    await act(async () => {
      render(<HintOverlay />);
    });

    const message = screen.getByTestId("hint-message");

    await act(async () => {
      fireEvent.click(message);
    });

    expect(sessionStorage.getItem("hint-dismissed")).toBe("true");
  });

  it("hides the overlay after clicking dismiss", async () => {
    await act(async () => {
      render(<HintOverlay />);
    });

    // Overlay should be visible
    expect(screen.getByTestId("hint-overlay")).toBeInTheDocument();

    const message = screen.getByTestId("hint-message");
    await act(async () => {
      fireEvent.click(message);
    });

    // Overlay should no longer be visible
    expect(screen.queryByTestId("hint-overlay")).not.toBeInTheDocument();
  });

  it("auto-dismisses after 5 seconds and writes sessionStorage flag", async () => {
    await act(async () => {
      render(<HintOverlay />);
    });

    expect(screen.getByTestId("hint-overlay")).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    expect(sessionStorage.getItem("hint-dismissed")).toBe("true");
    expect(screen.queryByTestId("hint-overlay")).not.toBeInTheDocument();
  });
});

describe("isHintDismissed / persistHintDismissed helpers", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("isHintDismissed returns false when flag is not set", () => {
    expect(isHintDismissed()).toBe(false);
  });

  it("isHintDismissed returns true after persistHintDismissed is called", () => {
    persistHintDismissed();
    expect(isHintDismissed()).toBe(true);
  });
});
