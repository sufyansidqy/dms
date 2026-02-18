'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface FileUploaderProps {
    docId: string;
    label?: string;
}

export default function FileUploader({ docId, label = 'Upload New Version' }: FileUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [changeLog, setChangeLog] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    async function handleUpload(file: File) {
        if (!file.name.endsWith('.docx') && !file.name.endsWith('.doc')) {
            setError('Only .docx files are supported');
            return;
        }

        setUploading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('docId', docId);
            formData.append('changeLog', changeLog || `Updated: ${file.name}`);

            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const result = await res.json();

            if (result.success) {
                setChangeLog('');
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
        const file = e.dataTransfer.files[0];
        if (file) handleUpload(file);
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
    }

    return (
        <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-text-primary)' }}>{label}</h3>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>
                    Change Log (optional)
                </label>
                <input
                    type="text"
                    value={changeLog}
                    onChange={(e) => setChangeLog(e.target.value)}
                    placeholder="Describe what changed..."
                    style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        border: '1px solid #E2E8F0',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem',
                    }}
                />
            </div>

            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                    border: `2px dashed ${isDragging ? 'var(--color-accent)' : '#CBD5E1'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '2rem',
                    textAlign: 'center',
                    cursor: uploading ? 'wait' : 'pointer',
                    backgroundColor: isDragging ? 'rgba(14,165,233,0.05)' : '#FAFAFA',
                    transition: 'all 0.2s',
                }}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".docx,.doc"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                {uploading ? (
                    <div style={{ color: 'var(--color-accent)' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏳</div>
                        <p>Uploading & processing...</p>
                    </div>
                ) : (
                    <div style={{ color: 'var(--color-text-secondary)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
                        <p style={{ fontWeight: 500, marginBottom: '0.25rem' }}>
                            Drop a .docx file here or click to browse
                        </p>
                        <p style={{ fontSize: '0.8125rem' }}>Supported format: .docx</p>
                    </div>
                )}
            </div>

            {error && (
                <p style={{ color: '#DC2626', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</p>
            )}
        </div>
    );
}
