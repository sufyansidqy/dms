'use client';

import { useState } from 'react';
import Link from 'next/link';
import DocumentForm from '@/components/DocumentForm';
import ProjectSettings from '@/components/ProjectSettings';
import { deleteProject } from '@/app/actions';
import { useRouter } from 'next/navigation';

interface Project {
    id: string;
    name: string;
    clientName: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

interface Document {
    id: string;
    title: string;
    category: string;
    status: string;
    updatedAt: Date;
}

interface ProjectDetailClientProps {
    project: Project;
    documents: Document[];
    isAdmin?: boolean;
    userRole?: string | null;
}

export default function ProjectDetailClient({ project, documents, isAdmin, userRole }: ProjectDetailClientProps) {
    const [showDocForm, setShowDocForm] = useState(false);
    const router = useRouter();

    async function handleDelete() {
        if (confirm('Are you sure you want to delete this project? This will also delete all its documents.')) {
            const result = await deleteProject(project.id);
            if (result.success) {
                router.push('/projects');
            }
        }
    }

    const statusColors: Record<string, { bg: string; text: string }> = {
        Draft: { bg: '#F1F5F9', text: '#475569' },
        Pending: { bg: '#FEF3C7', text: '#92400E' },
        Approved: { bg: '#D1FAE5', text: '#065F46' },
        Released: { bg: '#EDE9FE', text: '#5B21B6' },
        Rejected: { bg: '#FEE2E2', text: '#991B1B' },
    };

    const canCreateDoc = isAdmin || userRole === 'Creator';

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Link href="/projects" style={{ fontSize: '0.875rem', color: 'var(--color-accent)', textDecoration: 'none' }}>← Projects</Link>
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>{project.name}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                            Client: {project.clientName || 'None'}
                        </span>
                        <span style={{
                            display: 'inline-flex', padding: '2px 10px', borderRadius: '9999px',
                            fontSize: '0.75rem', fontWeight: 600,
                            backgroundColor: project.status === 'Active' ? '#D1FAE5' : '#F1F5F9',
                            color: project.status === 'Active' ? '#065F46' : '#475569',
                        }}>{project.status}</span>
                        {/* Show current user's role badge */}
                        {userRole && (
                            <span style={{
                                display: 'inline-flex', padding: '2px 10px', borderRadius: '9999px',
                                fontSize: '0.75rem', fontWeight: 600,
                                backgroundColor: userRole === 'Reviewer' ? '#EDE9FE' : userRole === 'Creator' ? '#D1FAE5' : '#F1F5F9',
                                color: userRole === 'Reviewer' ? '#5B21B6' : userRole === 'Creator' ? '#065F46' : '#475569',
                            }}>
                                Your Role: {userRole}
                            </span>
                        )}
                        {isAdmin && (
                            <span style={{
                                display: 'inline-flex', padding: '2px 10px', borderRadius: '9999px',
                                fontSize: '0.75rem', fontWeight: 600,
                                backgroundColor: '#FEF3C7', color: '#92400E',
                            }}>
                                Admin
                            </span>
                        )}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {canCreateDoc && (
                        <button onClick={() => setShowDocForm(true)} className="btn btn-primary">
                            + New Document
                        </button>
                    )}
                    {isAdmin && (
                        <button onClick={handleDelete} className="btn" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>
                            Delete Project
                        </button>
                    )}
                </div>
            </div>

            {/* Documents list */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #E2E8F0' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        Documents ({documents.length})
                    </h2>
                </div>

                {documents.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                        {canCreateDoc ? 'No documents yet. Click "New Document" to create one.' : 'No documents in this project yet.'}
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#FAFAFA', borderBottom: '1px solid #E2E8F0' }}>
                                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Title</th>
                                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Category</th>
                                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Status</th>
                                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((doc) => (
                                <tr key={doc.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                    <td style={{ padding: '0.75rem 1.5rem' }}>
                                        <Link href={`/documents/${doc.id}`} style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9375rem' }}>
                                            {doc.title}
                                        </Link>
                                    </td>
                                    <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{doc.category}</td>
                                    <td style={{ padding: '0.75rem 1.5rem' }}>
                                        <span style={{
                                            display: 'inline-flex', padding: '2px 10px', borderRadius: '9999px',
                                            fontSize: '0.75rem', fontWeight: 600,
                                            backgroundColor: statusColors[doc.status]?.bg || '#F1F5F9',
                                            color: statusColors[doc.status]?.text || '#475569',
                                        }}>{doc.status}</span>
                                    </td>
                                    <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                                        {new Date(doc.updatedAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Admin: Project Member Management */}
            {isAdmin && (
                <ProjectSettings projectId={project.id} />
            )}

            {showDocForm && <DocumentForm projectId={project.id} onClose={() => setShowDocForm(false)} />}
        </div>
    );
}
