export default function ClosestMatch(input: string, strings: Array<string>): string | null {
    let minDistance = Number.MAX_VALUE;
    let closestMatch = null;

    if (typeof input !== 'string') throw new TypeError('Input must be a string');
    if (!Array.isArray(strings)) throw new TypeError('Strings must be an array');
    if (strings.some(s => typeof s !== 'string')) throw new TypeError('Strings must only contain strings');
    
    if (strings.length === 0) return null;
  
    for (let i = 0; i < strings.length; i++) {
        const string = strings[i];
        if (typeof string !== 'string') {
            throw new TypeError('Strings must only contain strings');
        }

        const distance = levenshteinDistance(input, string);
        if (distance < minDistance) {
            minDistance = distance;
            closestMatch = string;
        }
    }
  
    return closestMatch;
}

function levenshteinDistance(a: string, b: string): number {

    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix:Array<Array<string | number>> = new Array(a.length + 1).fill(0).map( (_, i) => 
        new Array(b.length + 1).fill(0).map( (_, j) => {
            if (i === 0) return a.charCodeAt(j);
            if (j === 0) return b.charCodeAt(i);
            return 0;
        }
    ));

  
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            if (a[i - 1] === b[j - 1]) {
                // @ts-ignore
                matrix[i][j] = matrix[i - 1]?.[j - 1];
            } else {
                // It's ugly but the way the matrix is initialized there will never be an undefined value
                // TS has no knowledge of this so just need to ignore it all

                // @ts-ignore
                matrix[i][j] = Math.min(
                    // @ts-ignore
                    matrix[i - 1][j - 1] + 1, // substitution
                    // @ts-ignore
                    matrix[i][j - 1] + 1,     // insertion
                    // @ts-ignore
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }
  
    // @ts-ignore
    return matrix[a.length][b.length];
}
module.exports = exports.default;