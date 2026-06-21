/**
 * Unit tests for ContactPanel
 * Requirements: 8.4, 8.5
 */

import { jest } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactPanel, { validateContactForm } from "../panels/ContactPanel";

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
    a: React.forwardRef(
      (
        {
          children,
          ...rest
        }: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
          [key: string]: unknown;
        },
        ref: React.Ref<HTMLAnchorElement>,
      ) => React.createElement("a", { ...rest, ref }, children),
    ),
  };
  return { AnimatePresence, motion };
});

describe("ContactPanel", () => {
  it("valid submit shows confirmation message", async () => {
    const user = userEvent.setup();
    render(<ContactPanel />);

    await user.type(screen.getByLabelText("Your Name"), "Ada Lovelace");
    await user.type(screen.getByLabelText("Your Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Your Message"), "Hello there!");

    await user.click(screen.getByRole("button", { name: "Send Message" }));

    expect(
      screen.getByText("Thanks! I'll get back to you soon."),
    ).toBeInTheDocument();
  });

  it("missing name shows name error", async () => {
    const user = userEvent.setup();
    render(<ContactPanel />);

    await user.type(screen.getByLabelText("Your Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Your Message"), "Hello!");

    await user.click(screen.getByRole("button", { name: "Send Message" }));

    const alerts = screen.getAllByRole("alert");
    expect(alerts.some((el) => el.textContent === "Name is required.")).toBe(
      true,
    );
  });

  it("missing email shows email error", async () => {
    const user = userEvent.setup();
    render(<ContactPanel />);

    await user.type(screen.getByLabelText("Your Name"), "Ada Lovelace");
    await user.type(screen.getByLabelText("Your Message"), "Hello!");

    await user.click(screen.getByRole("button", { name: "Send Message" }));

    const alerts = screen.getAllByRole("alert");
    expect(
      alerts.some(
        (el) => el.textContent === "A valid email address is required.",
      ),
    ).toBe(true);
  });

  it("missing message shows message error", async () => {
    const user = userEvent.setup();
    render(<ContactPanel />);

    await user.type(screen.getByLabelText("Your Name"), "Ada Lovelace");
    await user.type(screen.getByLabelText("Your Email"), "ada@example.com");

    await user.click(screen.getByRole("button", { name: "Send Message" }));

    const alerts = screen.getAllByRole("alert");
    expect(alerts.some((el) => el.textContent === "Message is required.")).toBe(
      true,
    );
  });

  it("other field values are preserved when message is empty on submit", async () => {
    const user = userEvent.setup();
    render(<ContactPanel />);

    await user.type(screen.getByLabelText("Your Name"), "Ada Lovelace");
    await user.type(screen.getByLabelText("Your Email"), "ada@example.com");

    await user.click(screen.getByRole("button", { name: "Send Message" }));

    const alerts = screen.getAllByRole("alert");
    expect(alerts.some((el) => el.textContent === "Message is required.")).toBe(
      true,
    );

    expect(screen.getByLabelText("Your Name")).toHaveValue("Ada Lovelace");
    expect(screen.getByLabelText("Your Email")).toHaveValue("ada@example.com");
  });
});

describe("validateContactForm", () => {
  it("valid inputs return valid: true and empty errors", () => {
    const result = validateContactForm({
      name: "Ada",
      email: "ada@example.com",
      message: "Hello",
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("empty name sets errors.name", () => {
    const result = validateContactForm({
      name: "",
      email: "ada@example.com",
      message: "Hello",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBe("Name is required.");
  });

  it("empty email sets errors.email", () => {
    const result = validateContactForm({
      name: "Ada",
      email: "",
      message: "Hello",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBe("A valid email address is required.");
  });

  it("email without @ sets errors.email", () => {
    const result = validateContactForm({
      name: "Ada",
      email: "notanemail",
      message: "Hello",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBe("A valid email address is required.");
  });

  it("empty message sets errors.message", () => {
    const result = validateContactForm({
      name: "Ada",
      email: "ada@example.com",
      message: "",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.message).toBe("Message is required.");
  });
});
