import { isMobileViewport } from "../hooks/useMediaQuery";

describe("isMobileViewport", () => {
  it("returns true for width 767 (mobile boundary)", () => {
    expect(isMobileViewport(767)).toBe(true);
  });

  it("returns false for width 768 (desktop boundary)", () => {
    expect(isMobileViewport(768)).toBe(false);
  });

  it("returns false for width 769 (above desktop boundary)", () => {
    expect(isMobileViewport(769)).toBe(false);
  });

  it("returns true for widths well below 768", () => {
    expect(isMobileViewport(320)).toBe(true);
    expect(isMobileViewport(375)).toBe(true);
    expect(isMobileViewport(414)).toBe(true);
  });

  it("returns false for widths well above 768", () => {
    expect(isMobileViewport(1024)).toBe(false);
    expect(isMobileViewport(1440)).toBe(false);
  });
});
