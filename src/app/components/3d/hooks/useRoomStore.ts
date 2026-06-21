import { create } from "zustand";

export type FocusTarget =
  | "laptop"
  | "bookshelf"
  | "whiteboard"
  | "window"
  | "smartphone"
  | "monitor"
  | "coffee"
  | "sticky";

export interface CameraPreset {
  position: [number, number, number];
  lookAt: [number, number, number];
}

export interface RoomStore {
  focusTarget: FocusTarget | null;
  isAnimating: boolean;
  setFocus: (target: FocusTarget) => void;
  clearFocus: () => void;
  setAnimating: (v: boolean) => void;
}

export const FOCUS_TARGETS: FocusTarget[] = [
  "laptop",
  "bookshelf",
  "whiteboard",
  "window",
  "smartphone",
  "monitor",
  "coffee",
  "sticky",
];

export const useRoomStore = create<RoomStore>((set, get) => ({
  focusTarget: null,
  isAnimating: false,

  setFocus: (target: FocusTarget) => {
    // No-op when an animation is currently in progress
    if (get().isAnimating) return;
    set({ focusTarget: target });
  },

  clearFocus: () => {
    set({ focusTarget: null });
  },

  setAnimating: (v: boolean) => {
    set({ isAnimating: v });
  },
}));
