'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getDocumentById, getDocVersions, docVersions } from '@/lib/mock-data';
import { Document, DocVersion } from '@/lib/types';

// NOTE: In a real app, data fetching would be server-side or via API.
// Here we mix client-side logic with direct import for the prototype mock.
// We need to fetch data in a useEffect because we are in a Client Component.

export default function DocumentEditPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [doc, setDoc] = useState<Document | null>(null);
    const [currentContent, setCurrentContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching data
        const loadData = async () => {
            // We act like these are API calls
            // In a real SC, we'd pass initial data as props, but for this prototype...
            // We'll just assume we can't easily import server functions here directly 
            // if they were real DB calls, but since they are mock static data, it's fine-ish.
            // Actually, let's just use the imported data directly for the prototype.
            const d = (await import('@/lib/mock-data')).documents.find(d => d.id === params.id);
            if (d) {
                setDoc(d);
                const vs = (await import('@/lib/mock-data')).docVersions.filter(v => v.docId === d.id);
                const latest = vs.find(v => v.id === d.currentVersionId);
                if (latest) {
                    setCurrentContent(latest.textContent);
                }
            }
            setLoading(false);
        };
        loadData();
    }, [params.id]);

    const handleSave = async () => {
        if (!doc) return;

        // Simulate saving a new version
        // In a real app, POST to /api/documents/:id/versions
        alert("Prototype: Saving new version...");

        // We can't easily modify the server-side mock array from here and expect it to persist 
        // consistently across server reloads, but for the session it might work if the module is cached.
        // Let's try to simulate navigation back to details.

        router.push(`/documents/${doc.id}`);
    };

    if (loading) return <div>Loading...</div>;
    if (!doc) return <div>Document not found</div>;

    return (
        <div className="space-y-6">
            <div className="md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Editing: {doc.title}
                    </h2>
                </div>
            </div>

            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <div>
                        <label htmlFor="comment" className="block text-sm font-medium leading-6 text-gray-900">
                            Content (Markdown/Text)
                        </label>
                        <div className="mt-2">
                            <textarea
                                rows={15}
                                name="comment"
                                id="comment"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 font-mono"
                                value={currentContent}
                                onChange={(e) => setCurrentContent(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end gap-x-3">
                        <Link
                            href={`/documents/${doc.id}`}
                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            Cancel
                        </Link>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                            Save as New Version
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
