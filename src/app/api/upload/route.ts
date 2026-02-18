import { NextRequest, NextResponse } from 'next/server';
import { saveUploadedFile } from '@/lib/upload';
import { processDocx } from '@/lib/docx';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        let userId: string;

        const session = await getServerSession(authOptions);
        if (session && session.user && session.user.id) {
            userId = session.user.id;
        } else {
            // Fallback for dev/testing: Use the first available user (usually Admin)
            const fallbackUser = await prisma.user.findFirst();
            if (!fallbackUser) {
                return NextResponse.json({ error: 'No users found. Please seed the database.' }, { status: 500 });
            }
            userId = fallbackUser.id;
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const docId = formData.get('docId') as string | null;
        const projectId = formData.get('projectId') as string | null;
        const title = formData.get('title') as string | null;
        const category = formData.get('category') as string | null;
        const description = formData.get('description') as string | null;
        const changeLog = formData.get('changeLog') as string | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
        ];
        if (!validTypes.includes(file.type) && !file.name.endsWith('.docx') && !file.name.endsWith('.doc')) {
            return NextResponse.json({ error: 'Only .docx files are supported' }, { status: 400 });
        }

        // Convert to buffer for mammoth processing
        const buffer = Buffer.from(await file.arrayBuffer());
        const { html, text } = await processDocx(buffer);

        // CASE 1: New document (projectId + title provided)
        if (projectId && title) {
            const doc = await prisma.document.create({
                data: {
                    projectId,
                    title,
                    category: category || 'General',
                    description: description || null,
                    status: 'Draft',
                    createdById: userId,
                },
            });

            const fileInfo = await saveUploadedFile(file, doc.id, 1);

            const version = await prisma.docVersion.create({
                data: {
                    docId: doc.id,
                    versionNumber: 1,
                    filePath: fileInfo.filePath,
                    fileName: fileInfo.fileName,
                    fileMimeType: fileInfo.fileMimeType,
                    fileSize: fileInfo.fileSize,
                    textContent: text,
                    htmlContent: html,
                    changeLog: 'Initial upload',
                    createdById: userId,
                },
            });

            await prisma.document.update({
                where: { id: doc.id },
                data: { currentVersionId: version.id },
            });

            revalidatePath(`/projects/${projectId}`);
            revalidatePath('/');
            return NextResponse.json({ success: true, documentId: doc.id });
        }

        // CASE 2: New version of existing document (docId provided)
        if (docId) {
            const doc = await prisma.document.findUnique({ where: { id: docId } });
            if (!doc) {
                return NextResponse.json({ error: 'Document not found' }, { status: 404 });
            }

            const lastVersion = await prisma.docVersion.findFirst({
                where: { docId },
                orderBy: { versionNumber: 'desc' },
            });

            const nextVersionNum = (lastVersion?.versionNumber || 0) + 1;
            const fileInfo = await saveUploadedFile(file, docId, nextVersionNum);

            const version = await prisma.docVersion.create({
                data: {
                    docId,
                    versionNumber: nextVersionNum,
                    filePath: fileInfo.filePath,
                    fileName: fileInfo.fileName,
                    fileMimeType: fileInfo.fileMimeType,
                    fileSize: fileInfo.fileSize,
                    textContent: text,
                    htmlContent: html,
                    changeLog: changeLog || `Version ${nextVersionNum}`,
                    createdById: userId,
                },
            });

            await prisma.document.update({
                where: { id: docId },
                data: { currentVersionId: version.id },
            });

            revalidatePath(`/documents/${docId}`);
            revalidatePath(`/projects/${doc.projectId}`);
            return NextResponse.json({ success: true, versionId: version.id });
        }

        return NextResponse.json({ error: 'Either projectId+title or docId is required' }, { status: 400 });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
