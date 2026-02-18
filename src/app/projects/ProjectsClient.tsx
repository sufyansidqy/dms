'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProjectForm from '@/components/ProjectForm';

interface Project {
    id: string;
    name: string;
    clientName: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export default function ProjectsClient({ projects }: { projects: Project[] }) {
    const [showForm, setShowForm] = useState(false);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>Projects</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Manage all your projects and their documents</p>
                </div>
                <button onClick={() => setShowForm(true)} className="btn btn-primary">
                    + New Project
                </button>
            </div>

            {projects.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>No projects yet. Create your first project to get started.</p>
                    <button onClick={() => setShowForm(true)} className="btn btn-primary">Create Project</button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                    {projects.map((project) => (
                        <Link key={project.id} href={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
                            <div className="card" style={{ transition: 'transform 0.15s, box-shadow 0.15s', cursor: 'pointer' }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = ''; }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{project.name}</h3>
                                    <span style={{
                                        display: 'inline-flex', padding: '2px 10px', borderRadius: '9999px',
                                        fontSize: '0.75rem', fontWeight: 600,
                                        backgroundColor: project.status === 'Active' ? '#D1FAE5' : project.status === 'Completed' ? '#E0E7FF' : '#F1F5F9',
                                        color: project.status === 'Active' ? '#065F46' : project.status === 'Completed' ? '#3730A3' : '#475569',
                                    }}>{project.status}</span>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>{project.clientName || 'No client specified'}</p>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                                    Updated {new Date(project.updatedAt).toLocaleDateString()}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {showForm && <ProjectForm onClose={() => setShowForm(false)} />}
        </div>
    );
}
