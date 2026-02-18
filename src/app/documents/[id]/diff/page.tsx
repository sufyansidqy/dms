import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDocumentById, getDocVersions } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import * as Diff from 'diff';
import { ReviewSection } from '@/components/ReviewSection';

export default async function DocumentDiffPage({ params }: { params: { id: string } }) {
    const document = await getDocumentById(params.id);

    if (!document) {
        notFound();
    }

    const versions = await getDocVersions(document.id);
    // Sort descending
    const sorted = versions.sort((a, b) => b.versionNumber - a.versionNumber);

    if (sorted.length < 2) {
        return (
            <div className="p-8 text-center text-gray-500">
                Not enough versions to compare.
                <br />
                <Link href={`/documents/${document.id}`} className="text-blue-600 hover:underline">Back to Document</Link>
            </div>
        )
    }

    const newVer = sorted[0];
    const oldVer = sorted[1];

    const diff = Diff.diffLines(oldVer.textContent, newVer.textContent);

    return (
        <div className="space-y-6">
            <div className="md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Comparing v{oldVer.versionNumber} vs v{newVer.versionNumber}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        {document.title}
                    </p>
                </div>
                <div className="mt-4 flex flex-shrink-0 md:ml-4 md:mt-0">
                    <Link
                        href={`/documents/${document.id}`}
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        Back to Document
                    </Link>
                    <button
                        type="button"
                        className="ml-3 inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        Approve Changes
                    </button>
                </div>
            </div>

            <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                <div className="border-b border-gray-200 bg-gray-50 px-4 py-5 sm:px-6 flex justify-between">
                    <div className="w-1/2 font-semibold text-red-700 text-center">Version {oldVer.versionNumber} (Old)</div>
                    <div className="w-1/2 font-semibold text-green-700 text-center">Version {newVer.versionNumber} (New)</div>
                </div>
                <div className="font-mono text-sm max-h-[500px] overflow-y-auto">
                    {diff.map((part: any, index: number) => {
                        const color = part.added ? 'bg-green-100 text-green-800' :
                            part.removed ? 'bg-red-100 text-red-800' :
                                'text-gray-500';

                        return (
                            <div key={index} className={cn("px-4 py-1 border-b border-gray-100 whitespace-pre-wrap", color)}>
                                {part.value}
                            </div>
                        )
                    })}
                </div>
            </div>

            <ReviewSection docId={document.id} versionId={newVer.id} initialComments={[]} />
        </div>
    );
}
