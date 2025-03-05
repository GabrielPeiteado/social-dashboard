import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parseBoolean } from "@/utils/utils";

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = parseInt(req.nextUrl.pathname.split("/").pop(), 10);
  let socialData = parseBoolean(searchParams.get("social_data"));
  try {
    if (socialData === null) {
      throw new Error(
        "Invalid social_data param provided. Must be 'true' or 'false'."
      );
    }
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { socialData },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Error retrieving user: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  const userId = parseInt(req.nextUrl.pathname.split("/").pop(), 10);
  try {
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const { name, email, role } = await req.json();

    if (name && (typeof name !== "string" || name.trim().length < 2)) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }
    if (email && (typeof email !== "string" || !email.includes("@"))) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }
    if (role && !["user", "admin"].includes(role)) {
      return NextResponse.json(
        { error: "Role must be 'user' or 'admin'" },
        { status: 400 }
      );
    }

    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (email) {
      const emailExists = await prisma.user.findUnique({ where: { email } });
      if (emailExists && emailExists.id !== userId) {
        return NextResponse.json(
          { error: "Email already in use by another user" },
          { status: 409 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name ? name.trim() : undefined,
        email: email ? email.toLowerCase().trim() : undefined,
        role: role || undefined,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Error updating user: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const userId = parseInt(req.nextUrl.pathname.split("/").pop(), 10);
  try {
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Error deleting user: ${error.message}` },
      { status: 500 }
    );
  }
}
