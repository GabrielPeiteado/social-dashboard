import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parseBoolean } from "@/utils/utils";

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(req.nextUrl.pathname.split("/").pop(), 10);
  let user = parseBoolean(searchParams.get("user"));
  try {
    if (user === null) {
      throw new Error(
        "Invalid user param provided. Must be 'true' or 'false'."
      );
    }

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const socialData = await prisma.socialData.findUnique({
      where: { id },
      include: { user },
    });
    if (!socialData) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json(socialData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Error retrieving the record: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  const id = parseInt(req.nextUrl.pathname.split("/").pop(), 10);

  try {
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const body = await req.json();
    const { platform, followers, engagement, postsCount, userId } = body;

    if (!platform || typeof platform !== "string" || platform.length > 50) {
      return NextResponse.json(
        { error: "Platform must be a valid string with max 50 characters" },
        { status: 400 }
      );
    }

    if (typeof followers !== "number" || followers < 0) {
      return NextResponse.json(
        { error: "Followers must be a non-negative number" },
        { status: 400 }
      );
    }
    if (typeof engagement !== "number" || engagement < 0 || engagement > 100) {
      return NextResponse.json(
        { error: "Engagement must be between 0 and 100" },
        { status: 400 }
      );
    }
    if (typeof postsCount !== "number" || postsCount < 0) {
      return NextResponse.json(
        { error: "PostsCount must be a non-negative number" },
        { status: 400 }
      );
    }
    if (!userId || typeof userId !== "number") {
      return NextResponse.json(
        { error: "Valid userId is required" },
        { status: 400 }
      );
    }

    const existingRecord = await prisma.socialData.findUnique({
      where: { id },
    });
    if (!existingRecord) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    const updatedEntry = await prisma.socialData.update({
      where: { id },
      data: { platform, followers, engagement, postsCount, userId },
    });

    return NextResponse.json(updatedEntry, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Error updating the record: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const id = parseInt(req.nextUrl.pathname.split("/").pop(), 10);

  try {
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const existingRecord = await prisma.socialData.findUnique({
      where: { id },
    });
    if (!existingRecord) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    await prisma.socialData.delete({ where: { id } });
    return NextResponse.json(
      { message: "Record deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Error deleting the record: ${error.message}` },
      { status: 500 }
    );
  }
}
