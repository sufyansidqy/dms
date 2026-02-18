'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ReviewComment } from '@/lib/types';

interface ReviewSectionProps {
    docId: string;
    versionId: string;
    initialComments: ReviewComment[];
}

export function ReviewSection({ docId, versionId, initialComments }: ReviewSectionProps) {
    const router = useRouter();
    const [comments, setComments] = useState<ReviewComment[]>(initialComments);
    const [newComment, setNewComment] = useState('');

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        const comment: ReviewComment = {
            id: `c-${Date.now()}`,
            docVersionId: versionId,
            authorId: 'currentUser', // Mock
            content: newComment,
            resolved: false,
            createdAt: new Date().toISOString()
        };

        setComments([...comments, comment]);
        setNewComment('');
    };

    const handleApprove = () => {
        alert("Prototype: Document Approved! Status would change to 'Released'.");
        router.push(`/documents/${docId}`);
    };

    const handleReject = () => {
        alert("Prototype: Changes Requested. Status would revert to 'Draft'.");
        router.push(`/documents/${docId}`);
    };

    return (
        <div className="mt-8 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Review Comments</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="space-y-4">
                    {comments.length === 0 ? (
                        <p className="text-gray-500 text-sm">No comments yet.</p>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="flex space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">U</div>
                                </div>
                                <div>
                                    <div className="text-sm">
                                        <span className="font-medium text-gray-900">Reviewer</span>
                                        <span className="text-gray-500 ml-2">{new Date(comment.createdAt).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="mt-1 text-sm text-gray-700">
                                        <p>{comment.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-6">
                    <label htmlFor="comment" className="sr-only">Add your comment</label>
                    <textarea
                        rows={3}
                        name="comment"
                        id="comment"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        placeholder="Add a review comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className="mt-3 flex items-center justify-end">
                        <button
                            type="button"
                            onClick={handleAddComment}
                            className="inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            Post Comment
                        </button>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-6 flex justify-end gap-x-3">
                    <button
                        type="button"
                        onClick={handleReject}
                        className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-100"
                    >
                        Request Changes
                    </button>
                    <button
                        type="button"
                        onClick={handleApprove}
                        className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                    >
                        Approve & Release
                    </button>
                </div>
            </div>
        </div>
    );
}
