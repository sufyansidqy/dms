'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface DocumentFormProps {
    projectId: string;
    onClose: () => void;
}

export default function DocumentForm({ projectId, onClose }: DocumentFormProps) {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('General');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim()) return setError('Title is required');
        if (!file) return setError('Please upload a .docx file');

        setUploading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('projectId', projectId);
            formData.append('title', title);
            formData.append('category', category);
            formData.append('description', description);

            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const result = await res.json();

            if (result.success) {
                onClose();
                router.refresh();
            } else {
                setError(result.error || 'Upload failed');
            }
        } catch {
            setError('Upload failed');
        } finally {
            setUploading(false);
        }
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.name.endsWith('.docx') || droppedFile.name.endsWith('.doc'))) {
            setFile(droppedFile);
            if (!title) setTitle(droppedFile.name.replace(/\.(docx?|doc)$/, ''));
        } else {
            setError('Only .docx files are supported');
        }
    }

    return (
        <div style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
        }} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="card" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-text-primary)' }}>
                    Upload Document
                </h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem', color: 'var(--color-text-secondary)' }}>Title *</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                            style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }} />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem', color: 'var(--color-text-secondary)' }}>Category</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
                            <option>General</option>
                            <option>Technical</option>
                            <option>Legal</option>
                            <option>API</option>
                            <option>Design</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem', color: 'var(--color-text-secondary)' }}>Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
                            style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', resize: 'vertical' }} />
                    </div>

                    {/* File upload area */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem', color: 'var(--color-text-secondary)' }}>DOCX File *</label>
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                border: `2px dashed ${isDragging ? 'var(--color-accent)' : '#CBD5E1'}`,
                                borderRadius: 'var(--radius-md)',
                                padding: '1.5rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                backgroundColor: isDragging ? 'rgba(14,165,233,0.05)' : '#FAFAFA',
                                transition: 'all 0.2s',
                            }}
                        >
                            <input ref={fileInputRef} type="file" accept=".docx,.doc" onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) { setFile(f); if (!title) setTitle(f.name.replace(/\.(docx?|doc)$/, '')); }
                            }} style={{ display: 'none' }} />
                            {file ? (
                                <div>
                                    <span style={{ fontSize: '1.25rem' }}>📄</span>
                                    <p style={{ fontWeight: 500, color: 'var(--color-text-primary)', marginTop: '0.25rem' }}>{file.name}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                            ) : (
                                <div style={{ color: 'var(--color-text-secondary)' }}>
                                    <span style={{ fontSize: '1.5rem' }}>📄</span>
                                    <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Drop a .docx file or click to browse</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {error && <p style={{ color: '#DC2626', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{error}</p>}

                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={onClose} className="btn" disabled={uploading}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={uploading}>
                            {uploading ? 'Uploading...' : 'Upload Document'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
