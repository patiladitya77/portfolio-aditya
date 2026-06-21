/**
 * Unit tests for ContentPanelHost
 * Requirements: 9.1, 9.2, 9.3, 9.4
 */

import { jest } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import React from "react";
import { render, screen } from "@testing-library/react";
import {
  useRoomStore,
  FOCUS_TARGETS,
  FocusTarget,
} from "../hooks/useRoomStore";
import ContentPanelHost from "../panels/ContentPanelHost";

// ---------------------------------------------------------------------------
// Mock framer-motion to avoid animation issues in JSDOM
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Mock all panel components with simple identifiable divs
// ---------------------------------------------------------------------------
jest.mock("../panels/ProjectsPanel", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-projects-panel">ProjectsPanel</div>,
}));

jest.mock("../panels/SkillsPanel", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-skills-panel">SkillsPanel</div>,
}));

jest.mock("../panels/ExperiencePanel", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-experience-panel">ExperiencePanel</div>,
}));

jest.mock("../panels/AboutPanel", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-about-panel">AboutPanel</div>,
}));

jest.mock("../panels/ContactPanel", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-contact-panel">ContactPanel</div>,
}));

jest.mock("../panels/MonitorPanel", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-monitor-panel">MonitorPanel</div>,
}));

// ---------------------------------------------------------------------------
// Expected data-panel values per FocusTarget
// ---------------------------------------------------------------------------
const EXPECTED_PANEL_FOR_TARGET: Record<FocusTarget, string> = {
  laptop: "laptop",
  bookshelf: "bookshelf",
  whiteboard: "whiteboard",
  window: "window",
  smartphone: "smartphone",
  monitor: "monitor",
  coffee: "coffee",
  sticky: "sticky",
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("ContentPanelHost", () => {
  beforeEach(() => {
    useRoomStore.setState({ focusTarget: null, isAnimating: false });
  });

  it("renders nothing (no [data-panel] element) when focusTarget is null", () => {
    useRoomStore.setState({ focusTarget: null, isAnimating: false });
    render(<ContentPanelHost />);
    expect(document.querySelector("[data-panel]")).not.toBeInTheDocument();
  });

  it("renders nothing (no [data-panel] element) while isAnimating is true even if focusTarget is set", () => {
    useRoomStore.setState({ focusTarget: "laptop", isAnimating: true });
    render(<ContentPanelHost />);
    expect(document.querySelector("[data-panel]")).not.toBeInTheDocument();
  });

  describe("renders correct panel for each FocusTarget when isAnimating is false", () => {
    FOCUS_TARGETS.forEach((target) => {
      it(`renders data-panel="${target}" for focusTarget="${target}"`, () => {
        useRoomStore.setState({ focusTarget: target, isAnimating: false });
        render(<ContentPanelHost />);

        const panelEl = document.querySelector(
          `[data-panel="${EXPECTED_PANEL_FOR_TARGET[target]}"]`,
        );
        expect(panelEl).toBeInTheDocument();
      });
    });
  });
});
