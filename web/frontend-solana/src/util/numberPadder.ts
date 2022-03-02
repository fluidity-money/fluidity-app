/**
 * Appends padding to LEFT of number
 * @param num Number to pad
 * @param padLen Padding length
 * @param padding Padding char
 * @returns Padded string
 */
export const padNumStart = (num: number, padLen: number, padding: string): string => {
    const digits = Math.ceil(Math.log10(num + 1));
    return `${padding.repeat(Math.max(padLen - digits, 0))}${num || ''}`
}