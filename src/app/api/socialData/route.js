import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parseBoolean, socialPlatforms } from "@/utils/utils";

const prisma = new PrismaClient();

export async function GET(req) {
  const url = new URL(req.url);
  let user = parseBoolean(url.searchParams.get("user"));
  try {
    if (user === null) {
      throw new Error(
        "Invalid user param provided. Must be 'true' or 'false'."
      );
    }

    const socialData = await prisma.socialData.findMany({
      include: {
        user,
      },
    });

    return NextResponse.json(socialData, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: `Error retrieving data: ${error.message}`,
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req) {
  try {
    const { platform, followers, engagement, postsCount, userId } =
      await req.json();

    if (
      !platform ||
      typeof platform !== "string" ||
      platform.trim().length === 0 ||
      platform.length > 50
    ) {
      return NextResponse.json(
        {
          error: "Platform must be a valid string with max 50 characters",
        },
        {
          status: 400,
        }
      );
    }

    const normalizedPlatform = platform.trim();

    if (!socialPlatforms.includes(normalizedPlatform)) {
      return NextResponse.json(
        {
          error: `Invalid platform. Must be one of: ${socialPlatforms.join(
            ", "
          )}`,
        },
        {
          status: 400,
        }
      );
    }

    const followersInt = parseInt(followers, 10);
    const postsCountInt = parseInt(postsCount, 10);
    const engagementFloat = parseFloat(engagement);
    const userIdInt = parseInt(userId, 10);

    if (isNaN(followersInt) || followersInt < 0) {
      return NextResponse.json(
        {
          error: "Followers must be a non-negative number",
        },
        {
          status: 400,
        }
      );
    }
    if (
      isNaN(engagementFloat) ||
      engagementFloat < 0 ||
      engagementFloat > 100
    ) {
      return NextResponse.json(
        {
          error: "Engagement must be between 0 and 100",
        },
        {
          status: 400,
        }
      );
    }
    if (isNaN(postsCountInt) || postsCountInt < 0) {
      return NextResponse.json(
        {
          error: "PostsCount must be a non-negative number",
        },
        {
          status: 400,
        }
      );
    }
    if (isNaN(userIdInt) || userIdInt < 1) {
      return NextResponse.json(
        {
          error: "Valid userId is required",
        },
        {
          status: 400,
        }
      );
    }

    const userExists = await prisma.user.findUnique({
      where: {
        id: userIdInt,
      },
    });
    if (!userExists) {
      return NextResponse.json(
        {
          error: "User ID not found",
        },
        {
          status: 404,
        }
      );
    }

    const newRecord = await prisma.socialData.create({
      data: {
        platform: normalizedPlatform,
        followers: followersInt,
        engagement: engagementFloat,
        postsCount: postsCountInt,
        userId: userIdInt,
      },
    });

    return NextResponse.json(newRecord, {
      status: 201,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          error: "Duplicate entry detected",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        error: `Error creating record: ${error.message}`,
      },
      {
        status: 500,
      }
    );
  }
}
