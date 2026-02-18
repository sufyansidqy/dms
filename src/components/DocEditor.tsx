'use client';

import { useState } from 'react';
import { createVersion } from '@/app/actions';
import { useRouter } from 'next/navigation';

export default function DocEditor({ docId, currentContent }: { docId: string; currentContent: string }) {
    const [content, setContent] = useState(currentContent);
    const [changeLog, setChangeLog] = useState('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();

    async function handleSave() {
        if (!content.trim()) return;
        setSaving(true);
        setMessage('');

        const result = await createVersion(docId, content, changeLog || undefined);
        if (result.success) {
            setMessage('New version saved!');
            setChangeLog('');
            router.refresh();
        } else {
            setMessage(result.error || 'Failed to save');
        }
        setSaving(false);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Document Editor</h3>
                {message && (
                    <span style={{
                        fontSize: '0.875rem',
                        color: message.includes('Failed') ? '#EF4444' : 'var(--color-success)',
                        fontWeight: 500
                    }}>{message}</span>
                )}
            </div>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{
                    width: '100%',
                    minHeight: '400px',
                    padding: '1rem',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    border: '1px solid #E2E8F0',
                    borderRadius: 'var(--radius-md)',
                    outline: 'none',
                    resize: 'vertical',
                    backgroundColor: '#FAFAFA'
                }}
            />
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                        Change Log (optional)
                    </label>
                    <input
                        value={changeLog}
                        onChange={(e) => setChangeLog(e.target.value)}
                        className="input"
                        placeholder="Describe your changes..."
                    />
                </div>
                <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                    {saving ? 'Saving...' : 'Save as New Version'}
                </button>
            </div>
        </div>
    );
}
