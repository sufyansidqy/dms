'use client';

import { computeDiff, DiffLine } from '@/lib/diff';

export default function DiffViewer({ oldText, newText, oldLabel, newLabel }: {
    oldText: string;
    newText: string;
    oldLabel?: string;
    newLabel?: string;
}) {
    const { oldLines, newLines } = computeDiff(oldText, newText);

    const getLineStyle = (type: DiffLine['type']): React.CSSProperties => ({
        padding: '2px 8px',
        fontFamily: 'monospace',
        fontSize: '0.8125rem',
        lineHeight: '1.6',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        backgroundColor:
            type === 'added' ? 'rgba(16, 185, 129, 0.1)' :
                type === 'removed' ? 'rgba(239, 68, 68, 0.1)' :
                    'transparent',
        color:
            type === 'added' ? '#065F46' :
                type === 'removed' ? '#991B1B' :
                    'var(--color-text-primary)',
        borderLeft:
            type === 'added' ? '3px solid var(--color-success)' :
                type === 'removed' ? '3px solid #EF4444' :
                    '3px solid transparent',
    });

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Old version */}
            <div>
                <div style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(239, 68, 68, 0.05)',
                    borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                    border: '1px solid #FEE2E2',
                    borderBottom: 'none',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#991B1B'
                }}>
                    {oldLabel || 'Previous Version'}
                </div>
                <div style={{
                    border: '1px solid #E2E8F0',
                    borderRadius: '0 0 var(--radius-md) var(--radius-md)',
                    overflow: 'auto',
                    maxHeight: '500px'
                }}>
                    {oldLines.map((line, i) => (
                        <div key={i} style={getLineStyle(line.type)}>
                            <span style={{ display: 'inline-block', width: '2.5rem', color: 'var(--color-gray)', textAlign: 'right', marginRight: '0.75rem', userSelect: 'none' }}>
                                {line.lineNumber}
                            </span>
                            {line.type === 'removed' && <span style={{ fontWeight: 600, marginRight: '0.25rem' }}>-</span>}
                            {line.content}
                        </div>
                    ))}
                </div>
            </div>

            {/* New version */}
            <div>
                <div style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(16, 185, 129, 0.05)',
                    borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                    border: '1px solid #D1FAE5',
                    borderBottom: 'none',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#065F46'
                }}>
                    {newLabel || 'Current Version'}
                </div>
                <div style={{
                    border: '1px solid #E2E8F0',
                    borderRadius: '0 0 var(--radius-md) var(--radius-md)',
                    overflow: 'auto',
                    maxHeight: '500px'
                }}>
                    {newLines.map((line, i) => (
                        <div key={i} style={getLineStyle(line.type)}>
                            <span style={{ display: 'inline-block', width: '2.5rem', color: 'var(--color-gray)', textAlign: 'right', marginRight: '0.75rem', userSelect: 'none' }}>
                                {line.lineNumber}
                            </span>
                            {line.type === 'added' && <span style={{ fontWeight: 600, marginRight: '0.25rem' }}>+</span>}
                            {line.content}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
