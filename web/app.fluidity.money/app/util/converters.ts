const B64ToUint8Array = (b64string: string): Uint8Array =>
  Buffer.from(b64string, "base64");

export { B64ToUint8Array };
