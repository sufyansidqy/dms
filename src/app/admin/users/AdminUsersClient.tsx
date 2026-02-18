'use client';

import { useState } from 'react';
import { promoteToAdmin, demoteToUser } from '@/app/admin-actions';

interface User {
    id: string;
    name: string | null;
    email: string | null;
    systemRole: string;
    image: string | null;
}

interface AdminUsersClientProps {
    users: User[];
}

export default function AdminUsersClient({ users: initialUsers }: AdminUsersClientProps) {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [loading, setLoading] = useState<string | null>(null);

    async function handlePromote(userId: string) {
        setLoading(userId);
        const result = await promoteToAdmin(userId);
        if (result.success) {
            setUsers(users.map(u => u.id === userId ? { ...u, systemRole: 'Admin' } : u));
        } else {
            alert(result.error);
        }
        setLoading(null);
    }

    async function handleDemote(userId: string) {
        setLoading(userId);
        const result = await demoteToUser(userId);
        if (result.success) {
            setUsers(users.map(u => u.id === userId ? { ...u, systemRole: 'User' } : u));
        } else {
            alert(result.error);
        }
        setLoading(null);
    }

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
                    User Management
                </h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
                    Manage system-level roles. Promote users to Admin or demote them to User.
                </p>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #E2E8F0', backgroundColor: '#FAFAFA' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        All Users ({users.length})
                    </h2>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#FAFAFA', borderBottom: '1px solid #E2E8F0' }}>
                            <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>User</th>
                            <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Email</th>
                            <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>System Role</th>
                            <th style={{ padding: '0.75rem 1.5rem', textAlign: 'right', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                <td style={{ padding: '0.875rem 1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '50%',
                                            backgroundColor: user.systemRole === 'Admin' ? '#FEF3C7' : '#E0F2FE',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 600, fontSize: '0.875rem',
                                            color: user.systemRole === 'Admin' ? '#92400E' : '#0369A1',
                                        }}>
                                            {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                                        </div>
                                        <span style={{ fontWeight: 500, fontSize: '0.9375rem', color: 'var(--color-text-primary)' }}>
                                            {user.name || '(No name)'}
                                        </span>
                                    </div>
                                </td>
                                <td style={{ padding: '0.875rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                    {user.email}
                                </td>
                                <td style={{ padding: '0.875rem 1.5rem' }}>
                                    <span style={{
                                        display: 'inline-flex', padding: '2px 10px', borderRadius: '9999px',
                                        fontSize: '0.75rem', fontWeight: 600,
                                        backgroundColor: user.systemRole === 'Admin' ? '#FEF3C7' : '#F1F5F9',
                                        color: user.systemRole === 'Admin' ? '#92400E' : '#475569',
                                    }}>
                                        {user.systemRole}
                                    </span>
                                </td>
                                <td style={{ padding: '0.875rem 1.5rem', textAlign: 'right' }}>
                                    {user.systemRole === 'Admin' ? (
                                        <button
                                            onClick={() => handleDemote(user.id)}
                                            disabled={loading === user.id}
                                            style={{
                                                padding: '0.375rem 0.875rem', borderRadius: '6px', border: '1px solid #E2E8F0',
                                                backgroundColor: 'white', cursor: 'pointer', fontSize: '0.8125rem',
                                                color: '#991B1B', opacity: loading === user.id ? 0.5 : 1,
                                            }}
                                        >
                                            {loading === user.id ? '...' : 'Demote to User'}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handlePromote(user.id)}
                                            disabled={loading === user.id}
                                            style={{
                                                padding: '0.375rem 0.875rem', borderRadius: '6px', border: 'none',
                                                backgroundColor: 'var(--color-accent)', cursor: 'pointer', fontSize: '0.8125rem',
                                                color: 'white', opacity: loading === user.id ? 0.5 : 1,
                                            }}
                                        >
                                            {loading === user.id ? '...' : 'Promote to Admin'}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                        No users found.
                    </div>
                )}
            </div>
        </div>
    );
}
