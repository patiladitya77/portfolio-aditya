import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Experience from "@/models/Experience";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      role,
      company,
      workLocation,
      startDate,
      endDate,
      description,
      isCurrent,
      skills,
      order,
      isVisible,
    } = body;

    if (!role || !company || !workLocation || !startDate || !description) {
      return NextResponse.json(
        {
          error:
            "role, company, workLocation, startDate, and description are required",
        },
        { status: 400 },
      );
    }

    const experience = await Experience.create({
      role,
      company,
      workLocation,
      startDate,
      endDate: isCurrent ? null : endDate,
      description,
      isCurrent,
      skills,
      order,
      isVisible,
    });

    return NextResponse.json({ success: true, experience }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
