declare module "base58-js" {
  export function base58_to_binary(b58: string): Uint8Array;
  export function binary_to_base58(uint8: Uint8Array): string;
}
