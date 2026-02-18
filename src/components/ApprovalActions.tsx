'use client';

import { useState } from 'react';
import { submitForReview, approveDocument, rejectDocument, releaseDocument } from '@/app/actions';
import { useRouter } from 'next/navigation';

interface ApprovalActionsProps {
    docId: string;
    status: string;
    isAdmin?: boolean;
    userRole?: string | null;
}

export default function ApprovalActions({ docId, status, isAdmin, userRole }: ApprovalActionsProps) {
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState('');
    const router = useRouter();

    const canApprove = isAdmin || userRole === 'Reviewer';

    async function handleAction(action: 'submit' | 'approve' | 'reject' | 'release') {
        if ((action === 'approve' || action === 'reject') && !canApprove) {
            alert('You are not authorized to review this document.');
            return;
        }
        setLoading(true);

        let result;
        switch (action) {
            case 'submit':
                result = await submitForReview(docId);
                break;
            case 'approve':
                result = await approveDocument(docId, comment || undefined);
                break;
            case 'reject':
                result = await rejectDocument(docId, comment || undefined);
                break;
            case 'release':
                result = await releaseDocument(docId);
                break;
        }
        if (result?.success) {
            setComment('');
            router.refresh();
        }
        setLoading(false);
    }

    return (
        <div className="card" style={{ marginTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Workflow Actions</h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Current Status:</span>
                <span style={{
                    display: 'inline-flex', padding: '2px 10px', borderRadius: '9999px',
                    fontSize: '0.8125rem', fontWeight: 600,
                    backgroundColor:
                        status === 'Draft' ? '#F1F5F9' :
                            status === 'Pending' ? '#FEF3C7' :
                                status === 'Approved' ? '#D1FAE5' :
                                    status === 'Released' ? '#EDE9FE' :
                                        '#FEE2E2',
                    color:
                        status === 'Draft' ? '#475569' :
                            status === 'Pending' ? '#92400E' :
                                status === 'Approved' ? '#065F46' :
                                    status === 'Released' ? '#5B21B6' :
                                        '#991B1B',
                }}>
                    {status}
                </span>
            </div>

            {/* Review comment input for approve/reject */}
            {status === 'Pending' && (
                <div style={{ marginBottom: '1rem' }}>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="input"
                        rows={2}
                        placeholder="Add review comments (optional)..."
                        style={{ resize: 'vertical' }}
                    />
                </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {status === 'Draft' && (
                    <button onClick={() => handleAction('submit')} disabled={loading} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                        Submit for Review
                    </button>
                )}
                {status === 'Pending' && (
                    canApprove ? (
                        <>
                            <button onClick={() => handleAction('approve')} disabled={loading} className="btn" style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--color-success)', color: 'white' }}>
                                ✓ Approve
                            </button>
                            <button onClick={() => handleAction('reject')} disabled={loading} className="btn" style={{ padding: '0.5rem 1rem', backgroundColor: '#EF4444', color: 'white' }}>
                                ✕ Reject
                            </button>
                        </>
                    ) : (
                        <p className="text-sm text-gray-500 italic">Waiting for review (Only Reviewers can approve)</p>
                    )
                )}
                {status === 'Approved' && (
                    <button onClick={() => handleAction('release')} disabled={loading} className="btn" style={{ padding: '0.5rem 1rem', backgroundColor: '#7C3AED', color: 'white' }}>
                        🚀 Release
                    </button>
                )}
                {status === 'Rejected' && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                        Document was rejected. Edit the content and submit for review again.
                    </p>
                )}
                {status === 'Released' && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-success)', fontWeight: 500 }}>
                        ✅ This document has been released.
                    </p>
                )}
            </div>
        </div>
    );
}
