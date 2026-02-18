import { getAllUsers } from '@/app/admin-actions';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminUsersClient from './AdminUsersClient';

export default async function AdminUsersPage() {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const isAdmin = session?.user?.role === 'Admin';

    if (!isAdmin) {
        redirect('/projects');
    }

    const result = await getAllUsers();
    const users = result.success ? result.users || [] : [];

    return <AdminUsersClient users={users} />;
}
