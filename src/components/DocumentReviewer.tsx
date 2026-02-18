'use client';

import { useState, useRef } from 'react';
import DocViewer from './DocViewer';
import ReviewComments from './ReviewComments';

interface DocumentReviewerProps {
    htmlContent: string;
    versionId: string;
    comments: any[];
    currentUser: { name?: string | null; email?: string | null };
}

export default function DocumentReviewer({ htmlContent, versionId, comments, currentUser }: DocumentReviewerProps) {
    const [activeLine, setActiveLine] = useState<number | null>(null);
    const viewerRef = useRef<HTMLDivElement>(null);

    // Filter comments for active line if selected
    // Note: We pass ALL comments to ReviewComments so it can handle the tree structure.
    // However, if activeLine is set, we might want to VISUALLY filter or just scroll to them?
    // Current logic: passing filtered list. 
    // Issue: If we filter, we might break the parent-child relationship if parent is on line 5 and reply is also effectively on line 5 (inherited).
    // Better: Filter roots by line number.

    // BUT: If activeLine is set, we only show comments for that line.
    const relevantComments = activeLine
        ? comments.filter(c => c.lineNumber === activeLine)
        : comments;

    // Function to scroll to a specific line
    const scrollToLine = (lineNumber: number) => {
        setActiveLine(lineNumber);
        // Find the element with id `line-${lineNumber}` and scroll to it
        // We need to update DocViewer to add IDs to lines
        setTimeout(() => {
            const element = document.getElementById(`line-${lineNumber}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', height: 'calc(100vh - 200px)' }}>
            <div style={{ overflowY: 'auto', paddingRight: '1rem' }} ref={viewerRef}>
                <div className="card">
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>
                        Document Preview
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                        Click on any paragraph to add a comment or view existing ones.
                    </p>
                    <DocViewer
                        htmlContent={htmlContent}
                        activeLine={activeLine}
                        onLineClick={setActiveLine}
                        commentedLines={comments.map(c => c.lineNumber).filter(Boolean)}
                    />
                </div>
            </div>

            <div style={{ overflowY: 'auto', paddingLeft: '1rem', borderLeft: '1px solid #E2E8F0' }}>
                <div style={{ position: 'sticky', top: 0 }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                        {activeLine ? `Comments on Line ${activeLine}` : 'All Comments'}
                    </h3>
                    {activeLine && (
                        <button
                            onClick={() => setActiveLine(null)}
                            style={{
                                fontSize: '0.875rem', color: 'var(--color-accent)', background: 'none', border: 'none',
                                cursor: 'pointer', marginBottom: '1rem', padding: 0, textDecoration: 'underline'
                            }}
                        >
                            Show All Comments
                        </button>
                    )}

                    <ReviewComments
                        versionId={versionId}
                        comments={relevantComments}
                        activeLine={activeLine}
                        onNavigateToLine={scrollToLine}
                    />
                </div>
            </div>
        </div>
    );
}
