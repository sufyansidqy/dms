'use client';

import { useState } from 'react';
import { addComment, resolveComment } from '@/app/actions';
import { useRouter } from 'next/navigation';

interface Author {
    name: string | null;
    email: string | null;
}

interface Comment {
    id: string;
    content: string;
    lineNumber: number | null;
    resolved: boolean;
    createdAt: Date;
    author: Author;
    parentId: string | null;
    replies?: Comment[];
}

interface ReviewCommentsProps {
    versionId: string;
    comments: Comment[];
    activeLine?: number | null;
    onNavigateToLine?: (line: number) => void;
}

export default function ReviewComments({ versionId, comments, activeLine, onNavigateToLine }: ReviewCommentsProps) {
    const [newComment, setNewComment] = useState('');
    const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({}); // Map commentId -> content
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        const result = await addComment(versionId, newComment, activeLine || undefined);
        if (result.success) {
            setNewComment('');
            router.refresh();
        }
        setSubmitting(false);
    }

    async function handleReplySubmit(e: React.FormEvent, parentId: string) {
        e.preventDefault();
        const content = replyContent[parentId];
        if (!content?.trim()) return;

        setSubmitting(true);
        // Pass parentId to addComment
        const result = await addComment(versionId, content, undefined, parentId);
        if (result.success) {
            setReplyContent(prev => ({ ...prev, [parentId]: '' }));
            setReplyingTo(null);
            router.refresh();
        }
        setSubmitting(false);
    }

    async function handleResolve(commentId: string) {
        await resolveComment(commentId);
        router.refresh();
    }

    // Helper to render a single comment card
    const renderComment = (comment: Comment, isReply = false) => (
        <div key={comment.id} style={{
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #E2E8F0',
            backgroundColor: comment.resolved ? '#F0FDF4' : (isReply ? '#F8FAFC' : 'white'),
            opacity: comment.resolved ? 0.7 : 1,
            boxShadow: isReply ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
            marginLeft: isReply ? '1.5rem' : '0',
            marginTop: isReply ? '0.5rem' : '0',
            position: 'relative'
        }}>
            {isReply && <div style={{
                position: 'absolute', left: '-1rem', top: '50%', width: '0.75rem', height: '1px', backgroundColor: '#CBD5E1'
            }} />}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: '24px', height: '24px', borderRadius: '50%', backgroundColor: isReply ? '#F1F5F9' : '#E0F2FE',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: isReply ? '#64748B' : '#0284C7', fontSize: '0.75rem', fontWeight: 600
                    }}>
                        {(comment.author.name || '?')[0].toUpperCase()}
                    </div>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {comment.author.name || 'Unknown'}
                    </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    {new Date(comment.createdAt).toLocaleDateString()}
                </span>
            </div>

            {/* Line Number Badge (Clickable) */}
            {!activeLine && !isReply && comment.lineNumber && (
                <div style={{ marginBottom: '0.5rem' }}>
                    <button
                        onClick={() => onNavigateToLine?.(comment.lineNumber!)}
                        style={{
                            fontSize: '0.7rem', backgroundColor: '#F1F5F9', color: '#64748B',
                            padding: '2px 6px', borderRadius: '4px', fontWeight: 500,
                            border: '1px solid #E2E8F0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                        }}
                    >
                        Line {comment.lineNumber} ↗
                    </button>
                </div>
            )}

            <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                {comment.content}
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                {!comment.resolved && !isReply && (
                    <button
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        style={{ fontSize: '0.75rem', color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                    >
                        Reply
                    </button>
                )}

                {!comment.resolved && (
                    <button onClick={() => handleResolve(comment.id)} style={{
                        fontSize: '0.75rem', color: '#22C55E', background: 'none', border: 'none',
                        cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px'
                    }}>
                        ✓ Resolve
                    </button>
                )}
            </div>

            {/* Reply Form */}
            {replyingTo === comment.id && (
                <form onSubmit={(e) => handleReplySubmit(e, comment.id)} style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed #E2E8F0' }}>
                    <textarea
                        value={replyContent[comment.id] || ''}
                        onChange={(e) => setReplyContent(prev => ({ ...prev, [comment.id]: e.target.value }))}
                        className="input"
                        rows={2}
                        placeholder="Write a reply..."
                        style={{ width: '100%', resize: 'vertical', marginBottom: '0.5rem', fontSize: '0.8125rem' }}
                        autoFocus
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button type="button" onClick={() => setReplyingTo(null)} className="btn" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>Cancel</button>
                        <button type="submit" disabled={submitting} className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>Reply</button>
                    </div>
                </form>
            )}

            {/* Render Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div style={{ marginTop: '0.5rem' }}>
                    {comment.replies.map(reply => renderComment(reply, true))}
                </div>
            )}
        </div>
    );

    // Filter out replies from top-level list (they are nested under parents)
    // The query returns all comments. We need to associate them if they are flat, but `getCommentsByVersion` nests them.
    // Wait, the action `getCommentsByVersion` does fetching.
    // If I use `include: { replies: ... }`, then the top-level list will contain parents, and each parent has `replies`.
    // However, `findMany` on `ReviewComment` will return ALL comments that match `docVersionId`.
    // So if I have Parent A and Reply B (where B.parentId = A.id), fetching `where: { docVersionId }` returns BOTH A and B at top level?
    // Changes to data.ts: I am fetching ALL comments for the version. 
    // I need to filter the top-level list to ONLY show comments where `parentId` is null.

    const topLevelComments = comments.filter(c => !c.parentId);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Add comment form */}
            <div style={{
                marginBottom: '1rem', padding: '1rem',
                backgroundColor: activeLine ? 'rgba(56, 189, 248, 0.05)' : '#F8FAFC',
                borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0'
            }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                    {activeLine ? `Add comment to Line ${activeLine}:` : 'Add general comment:'}
                </h4>
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="input"
                        rows={3}
                        placeholder={activeLine ? `Comment on line ${activeLine}...` : "Write a general comment..."}
                        style={{ width: '100%', resize: 'vertical', marginBottom: '0.5rem', fontSize: '0.875rem' }}
                        autoFocus={!!activeLine}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" disabled={submitting} className="btn btn-primary" style={{ fontSize: '0.8125rem', padding: '0.4rem 0.8rem' }}>
                            {submitting ? 'Posting...' : 'Post Comment'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Comment list */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {topLevelComments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#94A3B8', fontSize: '0.875rem', fontStyle: 'italic' }}>
                        {activeLine ? `No comments on line ${activeLine} yet.` : 'No comments yet.'}
                    </div>
                ) : (
                    topLevelComments.map(comment => renderComment(comment))
                )}
            </div>
        </div>
    );
}
