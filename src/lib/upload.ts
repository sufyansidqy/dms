import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Ensure uploads directory exists
export function ensureUploadDir() {
    if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
}

/**
 * Save an uploaded file to local disk.
 * Returns the relative path (from project root) to the saved file.
 */
export async function saveUploadedFile(
    file: File,
    docId: string,
    versionNumber: number
): Promise<{ filePath: string; fileName: string; fileSize: number; fileMimeType: string }> {
    ensureUploadDir();

    const ext = path.extname(file.name) || '.docx';
    const safeName = `${docId}_v${versionNumber}${ext}`;
    const fullPath = path.join(UPLOAD_DIR, safeName);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(fullPath, buffer);

    return {
        filePath: `uploads/${safeName}`,
        fileName: file.name,
        fileSize: file.size,
        fileMimeType: file.type || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
}

/**
 * Read a file from the uploads directory and return as Buffer.
 */
export function readUploadedFile(filePath: string): Buffer {
    const fullPath = path.join(process.cwd(), filePath);
    return fs.readFileSync(fullPath);
}
