/**
 * Go encodes []byte as a `\x`-escaped B64 hex string
 * @param b64string the string to decode
 * @returns Uint8Array representing the original []byte array
 */

export const B64ToUint8Array = (b64string: string): Uint8Array =>
  Uint8Array.from(atob(b64string), c => c.charCodeAt(0))
