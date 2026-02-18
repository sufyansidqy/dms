import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // 1. Create Roles
    // Note: Our schema has roles as simple strings in User model for now, but if we had a Role model:
    // We don't have a Role model in the final schema I wrote? 
    // Let me check schema.prisma... I wrote `role String @default("Viewer")` in User.
    // Wait, the implementation plan had a `Role` model but I might have simplified it in the schema I wrote?
    // Let's check what I wrote to schema.prisma.

    // Checking schema.prisma content I wrote earlier:
    // model User { ... role String @default("Viewer") ... }
    // I did NOT include a separate Role model in the final schema file I wrote, unlike the plan.
    // The plan had `model Role` but the schema I wrote earlier (Step 262) removed it to simplify?
    // Actually, looking at Step 262: `role String @default("Viewer")`.
    // The plan (Step 261) showed `model Role` in the plan text but I might have deviated or the plan text had both?
    // Step 261 line 108: `model Role`.
    // Step 262 code content: I used `role String @default("Viewer")` and NO `model Role`.
    // This is a deviation. I should stick to the schema I wrote in 262 for now as it's active.
    // So I don't need to seed Roles table. 

    // I will seed a default project and user though.

    // 2. Create Default Admin User
    const adminEmail = 'admin@dms.com';
    // We can't easily seed a password because we are using Google Auth only.
    // But we can verify that the user exists so they can login (if we used email provider).
    // With Google Auth, the user is created on first login.
    // However, we might want to pre-create an admin so when they login with that email, they get Admin role.

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            name: 'Admin User',
            systemRole: 'Admin',
        },
    });

    console.log({ admin });

    // 3. Create Sample Project
    const project = await prisma.project.create({
        data: {
            name: 'Seed Project',
            clientName: 'Seed Client',
            status: 'Active',
            documents: {
                create: {
                    title: 'Seed Document',
                    category: 'Technical',
                    status: 'Draft',
                    createdById: admin.id,
                }
            }
        }
    });

    console.log({ project });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
