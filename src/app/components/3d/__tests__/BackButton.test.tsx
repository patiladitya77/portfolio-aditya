/**
 * Unit tests for BackButton
 * Requirements: 10.1, 10.4
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRoomStore } from "../hooks/useRoomStore";
import BackButton from "../BackButton";

describe("BackButton", () => {
  beforeEach(() => {
    // Reset store to known state
    useRoomStore.setState({ focusTarget: null, isAnimating: false });
  });

  it("is NOT visible when focusTarget is null", () => {
    useRoomStore.setState({ focusTarget: null });
    render(<BackButton />);
    expect(screen.queryByTestId("back-button")).not.toBeInTheDocument();
  });

  it("is visible when focusTarget is set", () => {
    useRoomStore.setState({ focusTarget: "laptop" });
    render(<BackButton />);
    expect(screen.getByTestId("back-button")).toBeInTheDocument();
  });

  it("shows Back text when focusTarget is active", () => {
    useRoomStore.setState({ focusTarget: "bookshelf" });
    render(<BackButton />);
    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  it("calls clearFocus when clicked", () => {
    useRoomStore.setState({ focusTarget: "laptop" });

    render(<BackButton />);
    const button = screen.getByTestId("back-button");
    fireEvent.click(button);

    expect(useRoomStore.getState().focusTarget).toBeNull();
  });

  it("calls clearFocus when Escape key is pressed", () => {
    useRoomStore.setState({ focusTarget: "whiteboard" });

    render(<BackButton />);

    fireEvent.keyDown(window, { key: "Escape" });

    expect(useRoomStore.getState().focusTarget).toBeNull();
  });

  it("does NOT clear focus on other key presses", () => {
    useRoomStore.setState({ focusTarget: "monitor" });

    render(<BackButton />);

    fireEvent.keyDown(window, { key: "Enter" });
    fireEvent.keyDown(window, { key: "Backspace" });

    expect(useRoomStore.getState().focusTarget).toBe("monitor");
  });

  it("removes keydown listener on unmount", () => {
    useRoomStore.setState({ focusTarget: "smartphone" });

    const { unmount } = render(<BackButton />);
    unmount();

    // After unmount, pressing Escape should no longer clear focus (no effect through old listener)
    // We set focus again and verify Escape after unmount doesn't fire the old listener
    useRoomStore.setState({ focusTarget: "smartphone" });
    fireEvent.keyDown(window, { key: "Escape" });

    // Because the listener was removed, focusTarget stays as is
    // (no new BackButton is mounted so no listener is active)
    expect(useRoomStore.getState().focusTarget).toBe("smartphone");
  });
});
