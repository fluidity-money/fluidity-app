// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

declare module "base58-js" {
  export function base58_to_binary(b58: string): Uint8Array;
  export function binary_to_base58(uint8: Uint8Array): string;
}
