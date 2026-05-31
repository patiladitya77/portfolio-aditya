import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Experience from "@/models/Experience";

export async function GET() {
  await connectDB();
  const experiences = await Experience.find({ isVisible: true }).sort({
    order: 1,
  });
  return NextResponse.json(experiences);
}
