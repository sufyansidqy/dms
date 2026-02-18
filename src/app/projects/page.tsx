import { getProjects } from '@/lib/data';
import ProjectsClient from './ProjectsClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function ProjectsPage() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    // @ts-ignore
    const isAdmin = session?.user?.role === 'Admin';

    // If not logged in, maybe redirect or show empty? 
    // For now, let's assume middleware handles auth or we just return empty.

    const projects = await getProjects(userId, isAdmin);
    return <ProjectsClient projects={projects} />;
}
