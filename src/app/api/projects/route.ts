import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";

export async function GET() {
  await connectDB();
  const projects = await Project.find({ isVisible: true }).sort({ order: 1 });
  return NextResponse.json(projects);
}
