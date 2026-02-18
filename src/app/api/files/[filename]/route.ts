import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    const { filename } = await params;

    // Security: Prevent directory traversal
    const safeFilename = path.basename(filename);
    const filePath = path.join(process.cwd(), 'uploads', safeFilename);

    if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    // Determine mime type (simple version)
    let contentType = 'application/octet-stream';
    if (filename.endsWith('.docx')) contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    else if (filename.endsWith('.doc')) contentType = 'application/msword';

    return new NextResponse(fileBuffer, {
        headers: {
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="${safeFilename}"`,
        },
    });
}
