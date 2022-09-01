// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

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