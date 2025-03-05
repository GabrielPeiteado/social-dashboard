import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parseBoolean } from "@/utils/utils";

const prisma = new PrismaClient();
const validSources = ["local", "external"];

export async function GET(req) {
  const url = new URL(req.url);
  const source = url.searchParams.get("source");
  let socialData = parseBoolean(url.searchParams.get("social_data"));
  try {
    if (socialData === null) {
        throw new Error("Invalid social_data param provided. Must be 'true' or 'false'.");
    }

    if (source && source !== "local" && source !== "external") {
      throw new Error(
        "Invalid source provided. Must be 'local' or 'external'."
      );
    }

    const whereCondition = validSources.includes(source) ? { source } : {};

    const users = await prisma.user.findMany({
      where: whereCondition,
      include: { socialData },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Error retrieving users: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { name, email, role } = await req.json();

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
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

    const emailExists = await prisma.user?.findUnique({ where: { email } });
    if (emailExists) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    const newUser = await prisma.user?.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role: role || "user",
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Error creating user: ${error.message}` },
      { status: 500 }
    );
  }
}
