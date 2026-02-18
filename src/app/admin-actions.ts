'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// ============ ADMIN: USER & MEMBER MANAGEMENT ============

export async function getAllUsers() {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, systemRole: true, image: true },
        });
        return { success: true, users };
    } catch (error) {
        console.error('Failed to fetch users:', error);
        return { success: false, error: 'Failed to fetch users' };
    }
}

export async function addProjectMember(formData: FormData) {
    const projectId = formData.get('projectId') as string;
    const userId = formData.get('userId') as string;
    const role = formData.get('role') as string;

    if (!projectId || !userId || !role) {
        return { success: false, error: 'Project, User, and Role are required' };
    }

    try {
        await prisma.projectMember.create({
            data: {
                projectId,
                userId,
                role,
            },
        });
        revalidatePath(`/projects/${projectId}`);
        revalidatePath('/admin/projects'); // If we have an admin page
        return { success: true };
    } catch (error) {
        console.error('Failed to add project member:', error);
        return { success: false, error: 'Failed to add member' };
    }
}

export async function removeProjectMember(memberId: string, projectId: string) {
    try {
        await prisma.projectMember.delete({
            where: { id: memberId },
        });
        revalidatePath(`/projects/${projectId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to remove project member:', error);
        return { success: false, error: 'Failed to remove member' };
    }
}

export async function getProjectMembers(projectId: string) {
    try {
        const members = await prisma.projectMember.findMany({
            where: { projectId },
            include: {
                user: { select: { id: true, name: true, email: true, image: true } },
            },
        });
        return { success: true, members };
    } catch (error) {
        console.error('Failed to fetch project members:', error);
        return { success: false, error: 'Failed to fetch members' };
    }
}

export async function promoteToAdmin(userId: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { systemRole: 'Admin' },
        });
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error('Failed to promote user:', error);
        return { success: false, error: 'Failed to promote user' };
    }
}

export async function demoteToUser(userId: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { systemRole: 'User' },
        });
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error('Failed to demote user:', error);
        return { success: false, error: 'Failed to demote user' };
    }
}

