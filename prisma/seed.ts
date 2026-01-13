import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AUTH_CONSTANTS } from "../src/lib/constants/auth";

const prisma = new PrismaClient();

const TEST_USERS = [
    {
        email: "admin@example.com",
        name: "Admin User",
        password: "Admin123!",
        role: "ADMIN" as const,
    },
    {
        email: "manager@example.com",
        name: "Manager User",
        password: "Manager123!",
        role: "MANAGER" as const,
    },
    {
        email: "user@example.com",
        name: "Regular User",
        password: "User123!",
        role: "USER" as const,
    },
];

async function main() {
    console.log("Memulai pengisian database (seeding)...");

    for (const userData of TEST_USERS) {
        const hashedPassword = await bcrypt.hash(
            userData.password,
            AUTH_CONSTANTS.SALT_ROUNDS
        );

        await prisma.user.upsert({
            where: { email: userData.email },
            update: {},
            create: {
                email: userData.email,
                name: userData.name,
                password: hashedPassword,
                role: userData.role,
            },
        });

        console.log(`✓ ${userData.role}: ${userData.email}`);
    }

    console.log("\nDatabase berhasil diisi!");
    console.log("\nAkun Uji Coba (Format Kata Sandi: Role123!):");
    console.log("  Admin:   admin@example.com   / Admin123!");
    console.log("  Manajer: manager@example.com / Manager123!");
    console.log("  User:    user@example.com    / User123!");
}

main()
    .catch((e) => {
        console.error("Terjadi kesalahan saat mengisi database:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });