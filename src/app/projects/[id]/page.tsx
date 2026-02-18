import { getProjectById, getDocumentsByProject, getUserProjectRole } from '@/lib/data';
import { notFound } from 'next/navigation';
import ProjectDetailClient from './ProjectDetailClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = await getProjectById(id);

    if (!project) {
        notFound();
    }

    const documents = await getDocumentsByProject(id);

    // Check if user is admin
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const isAdmin = session?.user?.role === 'Admin';

    // Get User Project Role
    const userRole = session?.user?.id ? await getUserProjectRole(session.user.id, id) : null;

    return <ProjectDetailClient project={project} documents={documents} isAdmin={isAdmin} userRole={userRole} />;
}
