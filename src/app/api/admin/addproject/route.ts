import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      title,
      description,
      longDescription,
      technologies,
      github,
      live,
      thumbnail,
      order,
      isFeatured,
      isVisible,
      category,
      status,
    } = body;

    if (!title || !description || !thumbnail || !technologies) {
      return NextResponse.json(
        {
          error: "title, description, thumbnail, and technologies are required",
        },
        { status: 400 },
      );
    }

    const project = await Project.create({
      title,
      description,
      longDescription,
      technologies,
      github,
      live,
      thumbnail,
      order,
      isFeatured,
      isVisible,
      category,
      status,
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: unknown }).code === 11000
    ) {
      return NextResponse.json(
        { error: "A project with that title already exists" },
        { status: 409 },
      );
    }
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
