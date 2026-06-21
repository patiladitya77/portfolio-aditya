"use client";

import { useMediaQuery } from "@/app/components/3d/hooks/useMediaQuery";
import MobileView from "@/app/components/3d/MobileView";
import RoomView from "@/app/components/3d/RoomView";

/**
 * Home — thin client wrapper that gates on viewport width.
 * - < 768 px  → MobileView (2D layout with all existing sections)
 * - ≥ 768 px  → RoomView  (interactive 3D developer room)
 *
 * Requirements: 12.1, 12.2, 14.1
 */
export default function Home() {
  const isDesktop = useMediaQuery(768);

  return isDesktop ? <RoomView /> : <MobileView />;
}
