// Simple line-by-line diff utility
export interface DiffLine {
    type: 'added' | 'removed' | 'unchanged';
    content: string;
    lineNumber: number;
}

export function computeDiff(oldText: string, newText: string): { oldLines: DiffLine[]; newLines: DiffLine[] } {
    const oldArr = oldText.split('\n');
    const newArr = newText.split('\n');

    const oldLines: DiffLine[] = [];
    const newLines: DiffLine[] = [];

    // Simple LCS-based diff
    const lcs = lcsMatrix(oldArr, newArr);
    let i = oldArr.length;
    let j = newArr.length;

    const result: Array<{ type: 'added' | 'removed' | 'unchanged'; oldLine?: string; newLine?: string }> = [];

    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && oldArr[i - 1] === newArr[j - 1]) {
            result.unshift({ type: 'unchanged', oldLine: oldArr[i - 1], newLine: newArr[j - 1] });
            i--;
            j--;
        } else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
            result.unshift({ type: 'added', newLine: newArr[j - 1] });
            j--;
        } else if (i > 0) {
            result.unshift({ type: 'removed', oldLine: oldArr[i - 1] });
            i--;
        }
    }

    let oldLineNum = 0;
    let newLineNum = 0;

    for (const item of result) {
        if (item.type === 'unchanged') {
            oldLineNum++;
            newLineNum++;
            oldLines.push({ type: 'unchanged', content: item.oldLine!, lineNumber: oldLineNum });
            newLines.push({ type: 'unchanged', content: item.newLine!, lineNumber: newLineNum });
        } else if (item.type === 'removed') {
            oldLineNum++;
            oldLines.push({ type: 'removed', content: item.oldLine!, lineNumber: oldLineNum });
        } else if (item.type === 'added') {
            newLineNum++;
            newLines.push({ type: 'added', content: item.newLine!, lineNumber: newLineNum });
        }
    }

    return { oldLines, newLines };
}

function lcsMatrix(a: string[], b: string[]): number[][] {
    const m = a.length;
    const n = b.length;
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (a[i - 1] === b[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    return dp;
}
