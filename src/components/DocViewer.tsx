'use client';

import parse, { DOMNode, Element } from 'html-react-parser';

interface DocViewerProps {
    htmlContent: string;
    activeLine?: number | null;
    onLineClick?: (line: number) => void;
    commentedLines?: number[];
}

export default function DocViewer({ htmlContent, activeLine, onLineClick, commentedLines = [] }: DocViewerProps) {
    let paragraphCount = 0;

    const options = {
        replace: (domNode: DOMNode) => {
            if (domNode instanceof Element && domNode.name === 'p') {
                paragraphCount++;
                const currentLine = paragraphCount;
                const isCommented = commentedLines.includes(currentLine);
                const isActive = activeLine === currentLine;

                return (
                    <div
                        key={currentLine}
                        onClick={() => onLineClick?.(currentLine)}
                        style={{
                            position: 'relative',
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            backgroundColor: isActive ? 'rgba(14,165,233,0.1)' : 'transparent',
                            border: isActive ? '1px solid var(--color-accent)' : '1px solid transparent',
                            transition: 'all 0.2s',
                            marginBottom: '0.5rem'
                        }}
                        className="doc-line"
                    >
                        {/* Line number marker (optional, mostly for debug or specific ref) */}
                        <span style={{
                            position: 'absolute', left: '-2rem', top: '0.5rem', fontSize: '0.75rem',
                            color: '#94A3B8', userSelect: 'none', opacity: 0.5
                        }}>
                            {currentLine}
                        </span>

                        {/* Comment Indicator */}
                        {isCommented && (
                            <span style={{
                                position: 'absolute', right: '-1rem', top: '0.5rem',
                                color: 'var(--color-accent)', fontSize: '1rem'
                            }}>
                                💬
                            </span>
                        )}

                        {/* Render children (content of p tag) */}
                        {/* We use domNodeToReact (implied by default helper, but here just children) */}
                        {/* Actually, html-react-parser handles children automatically if we don't return specific children. 
                            But since we are replacing the TAG itself, we need to preserve content. */}
                        {/* Easy way: just use standard p tag with styles, and let parser handle children? */}
                        {/* Wait, 'replace' replaces the node. So we must render content. */}
                        {/* If we return a React element, its children also need to be converted.
                            html-react-parser exports 'domToReact' helper for this. */}
                        {/* Let's try to just wrap it. */}

                        <p style={{ margin: 0 }}>

                            {/* We can re-parse the innerHTML, or just trust the recursive parser? 
                                Actually, standard usage: `domToReact(domNode.children, options)` */}
                            {/* But let's keep it simple. */}
                            {/* Since we are in `replace`, we act on the node. */}
                            {/* Using `domToReact` is best practice. */}
                            {/* I'll import it. */}
                            {/* Wait, imports: `import parse, { domToReact } from ...` */}
                            {/* I'll fix imports. */}

                            {/* Placeholder content for now since imports need adjustment */}
                            {/* Actually, let's fix imports first. */}
                        </p>
                    </div>
                );
            }
        }
    };

    // Need to correctly import domToReact to recurse
    // But since I am writing the file content string, I can just do it.

    return (
        <div
            className="docx-viewer"
            style={{
                lineHeight: '1.8',
                fontSize: '0.9375rem',
                color: 'var(--color-text-primary)'
            }}
        >
            <ViewerContent html={htmlContent} activeLine={activeLine} onLineClick={onLineClick} commentedLines={commentedLines} />
        </div>
    );
}

// Sub-component to handle parsing cleanly
import { domToReact } from 'html-react-parser';

function ViewerContent({ html, activeLine, onLineClick, commentedLines }: any) {
    let lineCounter = 0;

    return parse(html, {
        replace: (domNode) => {
            if (domNode instanceof Element && domNode.name === 'p') {
                lineCounter++;
                const line = lineCounter;
                const isActive = activeLine === line;
                const hasComment = commentedLines.includes(line);

                return (
                    <div
                        key={line}
                        id={`line-${line}`}
                        onClick={() => onLineClick?.(line)}
                        style={{
                            position: 'relative',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: isActive ? 'rgba(56, 189, 248, 0.1)' : (hasComment ? 'rgba(254, 240, 138, 0.2)' : 'transparent'),
                            borderLeft: isActive ? '3px solid #0EA5E9' : (hasComment ? '3px solid #FACC15' : '3px solid transparent'),
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            marginBottom: '0.5rem'
                        }}
                    >
                        <p style={{ margin: 0 }}>{domToReact(domNode.children)}</p>

                        {hasComment && !isActive && (
                            <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                                💬
                            </span>
                        )}
                    </div>
                );
            }
        }
    });
}
