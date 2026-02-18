import { prisma } from './prisma';
import { unstable_noStore as noStore } from 'next/cache';

// Projects
export async function getProjects(userId?: string, isAdmin?: boolean) {
    noStore();
    try {
        if (isAdmin) {
            return await prisma.project.findMany({
                orderBy: { updatedAt: 'desc' },
            });
        }

        if (userId) {
            // Find projects where user is a member
            return await prisma.project.findMany({
                where: {
                    members: { some: { userId } }
                },
                orderBy: { updatedAt: 'desc' },
            });
        }

        // If no user context (public? or error?), return empty or handle authentication upstream
        return [];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch projects.');
    }
}

export async function getProjectById(id: string) {
    noStore();
    try {
        const project = await prisma.project.findUnique({
            where: { id },
        });
        return project;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch project.');
    }
}

// Documents
export async function getDocumentsByProject(projectId: string) {
    noStore();
    try {
        const documents = await prisma.document.findMany({
            where: { projectId },
            orderBy: { updatedAt: 'desc' },
        });
        return documents;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch documents.');
    }
}

export async function getDocumentById(id: string) {
    noStore();
    try {
        const document = await prisma.document.findUnique({
            where: { id },
        });
        return document;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch document.');
    }
}

// Versions
export async function getDocVersions(docId: string) {
    noStore();
    try {
        const versions = await prisma.docVersion.findMany({
            where: { docId },
            orderBy: { versionNumber: 'desc' },
        });
        return versions;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch versions.');
    }
}

export async function getDocVersionById(id: string) {
    noStore();
    try {
        const version = await prisma.docVersion.findUnique({
            where: { id },
        });
        return version;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch version.');
    }
}

// Comments for a version
export async function getCommentsByVersion(docVersionId: string) {
    noStore();
    try {
        const comments = await prisma.reviewComment.findMany({
            where: { docVersionId },
            include: {
                author: { select: { name: true, email: true } },
                replies: {
                    include: {
                        author: { select: { name: true, email: true } }
                    },
                    orderBy: { createdAt: 'asc' }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
        return comments;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch comments.');
    }
}

// Approvals for a version
export async function getApprovalsByVersion(docVersionId: string) {
    noStore();
    try {
        const approvals = await prisma.approval.findMany({
            where: { docVersionId },
            include: {
                approver: { select: { name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return approvals;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch approvals.');
    }
}

// Dashboard stats
export async function getDashboardStats() {
    noStore();
    try {
        const [activeProjects, totalDocuments, pendingReviews] = await Promise.all([
            prisma.project.count({ where: { status: 'Active' } }),
            prisma.document.count(),
            prisma.document.count({ where: { status: 'Pending' } }),
        ]);
        return { activeProjects, totalDocuments, pendingReviews };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch stats.');
    }
}

export async function getUserProjectRole(userId: string, projectId: string) {
    noStore();
    try {
        const member = await prisma.projectMember.findUnique({
            where: {
                projectId_userId: {
                    projectId,
                    userId,
                },
            },
        });
        return member?.role || null;
    } catch (error) {
        console.error('Database Error:', error);
        return null;
    }
}
