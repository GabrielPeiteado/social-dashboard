const { socialPlatforms } = require("../src/utils/utils");
const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const prisma = new PrismaClient();


const JSON_PLACEHOLDER_URL = process.env.NEXT_PUBLIC_JSON_PLACEHOLDER_URL;
const USERS_URL = JSON_PLACEHOLDER_URL ? `${JSON_PLACEHOLDER_URL}/users` : null;

async function main() {
  console.log("🌱 Seeding database...");

  const user1 = await prisma.user.create({
    data: {
      name: "Gabriel",
      email: "gabriel@example.com",
      role: "admin",
      source: "local",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Maria",
      email: "maria@example.com",
      role: "user",
    },
  });

  console.log("Local users created");

  let jsonPlaceholderUsers = [];
  if (USERS_URL) {
    try {
      console.log("Fetching users from JSONPlaceholder...");
      const response = await axios.get(USERS_URL, { timeout: 5000 });
      jsonPlaceholderUsers = response.data;
      console.log(
        `Retrieved ${jsonPlaceholderUsers.length} users from JSONPlaceholder`
      );
    } catch (error) {
      console.error("Error fetching JSONPlaceholder users:", error.message);
    }
  } else {
    console.warn("⚠️ JSONPlaceholder URL is not set, skipping external users");
  }

  const createdUsers = await Promise.all(
    jsonPlaceholderUsers.map(async (user) => {
      return await prisma.user.create({
        data: {
          name: user.name,
          email: user.email.toLowerCase(),
          role: "user",
          source: "external",
        },
      });
    })
  );

  console.log(`Created ${createdUsers.length} users from JSONPlaceholder`);

  const socialDataEntries = [
    {
      platform: "Instagram",
      followers: 243000,
      engagement: 7.45,
      postsCount: 345,
      userId: user1.id,
    },
    {
      platform: "Twitter",
      followers: 58300,
      engagement: 3.29,
      postsCount: 128,
      userId: user1.id,
    },
    {
      platform: "LinkedIn",
      followers: 105700,
      engagement: 2.84,
      postsCount: 87,
      userId: user2.id,
    },
    {
      platform: "Facebook",
      followers: 487500,
      engagement: 6.02,
      postsCount: 512,
      userId: user2.id,
    },
  ];
  
  createdUsers.forEach((user) => {
    const randomPlatform = socialPlatforms[Math.floor(Math.random() * socialPlatforms.length)];
  
    socialDataEntries.push({
      platform: randomPlatform,
      followers: Math.floor(Math.random() * 500000),
      engagement: parseFloat((Math.random() * 10).toFixed(2)),
      postsCount: Math.floor(Math.random() * 300),
      userId: user.id,
    });
  });
  

  await prisma.socialData.createMany({ data: socialDataEntries });

  console.log(`Inserted ${socialDataEntries.length} social data entries`);

  console.log("Database seeded successfully!");
}

if (process.env.NODE_ENV === "production") {
  console.log("Seeding skipped in production.");
  return process.exit(0);
} else {
  main()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
}
