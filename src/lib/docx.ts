import mammoth from 'mammoth';

/**
 * Convert DOCX buffer to HTML for rendering in the browser.
 */
export async function docxToHtml(buffer: Buffer): Promise<string> {
    const result = await mammoth.convertToHtml({ buffer });
    return result.value;
}

/**
 * Extract raw text from DOCX buffer for diffing and search.
 */
export async function docxToText(buffer: Buffer): Promise<string> {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
}

/**
 * Process a DOCX file buffer and return both HTML and text representations.
 */
export async function processDocx(buffer: Buffer): Promise<{ html: string; text: string }> {
    const [html, text] = await Promise.all([
        docxToHtml(buffer),
        docxToText(buffer),
    ]);
    return { html, text };
}
