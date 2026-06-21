import { useRoomStore } from "../hooks/useRoomStore";

describe("useRoomStore", () => {
  beforeEach(() => {
    // Reset the store to its initial state before each test
    useRoomStore.setState({ focusTarget: null, isAnimating: false });
  });

  it("setFocus sets focusTarget to the given value", () => {
    const { setFocus } = useRoomStore.getState();
    setFocus("laptop");
    expect(useRoomStore.getState().focusTarget).toBe("laptop");
  });

  it("setFocus updates focusTarget when called with a different target", () => {
    const { setFocus } = useRoomStore.getState();
    setFocus("bookshelf");
    expect(useRoomStore.getState().focusTarget).toBe("bookshelf");

    setFocus("whiteboard");
    expect(useRoomStore.getState().focusTarget).toBe("whiteboard");
  });

  it("clearFocus resets focusTarget to null", () => {
    // First set a focus target
    useRoomStore.setState({ focusTarget: "laptop" });
    expect(useRoomStore.getState().focusTarget).toBe("laptop");

    // Then clear it
    const { clearFocus } = useRoomStore.getState();
    clearFocus();
    expect(useRoomStore.getState().focusTarget).toBeNull();
  });

  it("setAnimating(true) sets isAnimating to true", () => {
    const { setAnimating } = useRoomStore.getState();
    setAnimating(true);
    expect(useRoomStore.getState().isAnimating).toBe(true);
  });

  it("setAnimating(false) sets isAnimating to false", () => {
    // Start with animating true
    useRoomStore.setState({ isAnimating: true });
    const { setAnimating } = useRoomStore.getState();
    setAnimating(false);
    expect(useRoomStore.getState().isAnimating).toBe(false);
  });

  it("setFocus is a no-op when isAnimating === true", () => {
    // Set a focus target first, then lock with animation
    useRoomStore.setState({ focusTarget: "laptop", isAnimating: true });

    const { setFocus } = useRoomStore.getState();
    setFocus("bookshelf");

    // focusTarget should remain "laptop" since isAnimating was true
    expect(useRoomStore.getState().focusTarget).toBe("laptop");
  });

  it("setFocus is a no-op when isAnimating === true and focusTarget is null", () => {
    // Start with null focusTarget but animation in progress
    useRoomStore.setState({ focusTarget: null, isAnimating: true });

    const { setFocus } = useRoomStore.getState();
    setFocus("monitor");

    // focusTarget should remain null since isAnimating was true
    expect(useRoomStore.getState().focusTarget).toBeNull();
  });
});
