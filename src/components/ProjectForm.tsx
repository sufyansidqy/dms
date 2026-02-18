'use client';

import { useState } from 'react';
import { createProject } from '@/app/actions';

export default function ProjectForm({ onClose }: { onClose: () => void }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const result = await createProject(formData);

        if (result.success) {
            onClose();
        } else {
            setError(result.error || 'Failed to create project');
        }
        setLoading(false);
    }

    return (
        <div style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 50
        }}>
            <div style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                width: '100%',
                maxWidth: '480px',
                boxShadow: 'var(--shadow-lg)'
            }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Create New Project</h2>
                {error && <p style={{ color: '#EF4444', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                            Project Name *
                        </label>
                        <input name="name" required className="input" placeholder="e.g. API Documentation" />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                            Client Name
                        </label>
                        <input name="clientName" className="input" placeholder="e.g. PT. Example" />
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={onClose} className="btn" style={{ background: '#F1F5F9', color: 'var(--color-text-primary)' }}>
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="btn btn-primary">
                            {loading ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
