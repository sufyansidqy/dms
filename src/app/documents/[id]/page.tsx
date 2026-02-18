import { getDocumentById, getDocVersions, getCommentsByVersion, getUserProjectRole } from '@/lib/data';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notFound } from 'next/navigation';
import Link from 'next/link';
// import DocViewer from '@/components/DocViewer'; // Now inside DocumentReviewer
import DocumentReviewer from '@/components/DocumentReviewer';
import DiffViewer from '@/components/DiffViewer';
import FileUploader from '@/components/FileUploader';
// import ReviewComments from '@/components/ReviewComments'; // Now inside DocumentReviewer
import ApprovalActions from '@/components/ApprovalActions';

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const document = await getDocumentById(id);

    if (!document) {
        notFound();
    }

    const versions = await getDocVersions(id);
    const currentVer = versions.find(v => v.id === document.currentVersionId);
    const previousVer = versions.length >= 2 ? versions[1] : null;

    const comments = currentVer ? await getCommentsByVersion(currentVer.id) : [];

    // Check Permissions
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const isAdmin = session?.user?.role === 'Admin';
    const userRole = session?.user?.id ? await getUserProjectRole(session.user.id, document.projectId) : null;

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <Link href={`/projects/${document.projectId}`} style={{ fontSize: '0.875rem', color: 'var(--color-accent)', textDecoration: 'none' }}>← Back to Project</Link>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-primary)', marginTop: '0.5rem', marginBottom: '0.5rem' }}>{document.title}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    <span>Category: <strong>{document.category}</strong></span>
                    {document.description && <span>• {document.description}</span>}
                    {currentVer?.fileName && <span>• 📄 {currentVer.fileName}</span>}
                    {currentVer?.fileSize && <span>• {(currentVer.fileSize / 1024).toFixed(1)} KB</span>}
                </div>
            </div>

            {/* Approval actions */}
            <ApprovalActions docId={document.id} status={document.status} isAdmin={isAdmin} userRole={userRole} />

            {/* Document Content (DOCX rendered as HTML) */}
            {/* Interactive Document Reviewer (Viewer + Comments) */}
            {currentVer?.htmlContent && (
                <div style={{ marginTop: '1.5rem', height: 'calc(100vh - 200px)' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                        {currentVer.filePath && (
                            <a
                                href={`/api/files/${currentVer.filePath.split('/').pop()}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn"
                                style={{ fontSize: '0.875rem', padding: '0.4rem 0.8rem', textDecoration: 'none' }}
                            >
                                📥 Download Original
                            </a>
                        )}
                    </div>

                    <DocumentReviewer
                        htmlContent={currentVer.htmlContent}
                        versionId={currentVer.id}
                        comments={comments}
                        currentUser={{}} // TODO: Pass real user
                    />
                </div>
            )}

            {/* Version History */}
            <div className="card" style={{ marginTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Version History ({versions.length})</h3>
                {versions.length === 0 ? (
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>No versions yet. Upload a .docx file to create the first version.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {versions.map((v) => (
                            <div key={v.id} style={{
                                padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                                border: '1px solid #E2E8F0',
                                backgroundColor: v.id === document.currentVersionId ? 'rgba(14,165,233,0.05)' : 'white',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                            }}>
                                <div>
                                    <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-text-primary)' }}>
                                        v{v.versionNumber}
                                    </span>
                                    {v.id === document.currentVersionId && (
                                        <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 500 }}>Current</span>
                                    )}
                                    {v.fileName && (
                                        <span style={{ marginLeft: '0.75rem', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>📄 {v.fileName}</span>
                                    )}
                                    {v.changeLog && (
                                        <span style={{ marginLeft: '0.75rem', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>— {v.changeLog}</span>
                                    )}
                                </div>
                                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                                    {new Date(v.createdAt).toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Diff Viewer (extracted text comparison) */}
            {previousVer && currentVer && previousVer.textContent && currentVer.textContent && (
                <div className="card" style={{ marginTop: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
                        Text Changes (v{previousVer.versionNumber} → v{currentVer.versionNumber})
                    </h3>
                    <DiffViewer
                        oldText={previousVer.textContent}
                        newText={currentVer.textContent}
                        oldLabel={`v${previousVer.versionNumber}`}
                        newLabel={`v${currentVer.versionNumber}`}
                    />
                </div>
            )}

            {/* Review Comments */}


            {/* File Uploader (for creating new versions) */}
            {(document.status === 'Draft' || document.status === 'Rejected') && (isAdmin || userRole === 'Creator') && (
                <div className="card" style={{ marginTop: '1.5rem' }}>
                    <FileUploader docId={document.id} label="Upload New Version (.docx)" />
                </div>
            )}
        </div>
    );
}
