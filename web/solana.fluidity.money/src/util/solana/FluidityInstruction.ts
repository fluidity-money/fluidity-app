// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE.md file.

import {Enum as SolanaEnum, SOLANA_SCHEMA, PublicKey} from '@solana/web3.js';
import {TokenAmount} from "@saberhq/token-utils";
import BN from 'bn.js';
import {BinaryWriter} from 'borsh';
import {SupportedTokens} from 'components/types';
import {FLUID_PROGRAM_ID} from './constants';

type FluidityInstructionCtor = {TokenSymbol: SupportedTokens, bumpSeed: number} & ({Wrap: TokenAmount, Unwrap?: null} | {Wrap?: null, Unwrap: TokenAmount});

//Implements the Rust enum for wrapping and unwrapping a fluid asset
//Does not support decoding (encoding is done manually to support tuple enum)
export class FluidityInstruction extends SolanaEnum {
  //we are targeting ES5, so opting for typescript's `private` keyword instead of using #updated
  private static updated = false;
  //pass an amount in base units (i.e. 1 = smallest )
  constructor(amount: FluidityInstructionCtor) {
    if (!FluidityInstruction.updated) {
        //update the schema once, so that we can serialise with borsh
        SOLANA_SCHEMA.set(FluidityInstruction, {
            kind: 'enum', 
            field:'enum', 
            values: [
              // amount, seed, bump 
              ['Wrap', ['u64', 'String', 'u8']],
              ['Unwrap', ['u64', 'String', 'u8']],
              ['Payout', 'u64'],
              ['InitSolendObligation', ['u64', 'u64', 'String', 'u8']],
            ],
        });
        FluidityInstruction.updated = true;
    }

    const field = amount.Wrap ? "Wrap" : "Unwrap";

    // if serialising then deserialising, TokenAmount is converted to a BN, so support both
    // convert both to a BN
    // we pass it the amount, token-specific mint seed, and the predetermined bump seed
    if (typeof amount[field]?.toU64 === 'function') {
      super({
        [field]:
          [
            amount[field]?.toU64(),
            amount.TokenSymbol,
            amount.bumpSeed,
          ]
      })
    } else {
      super({
        [field]:
          [
            amount[field],
            amount.TokenSymbol,
            amount.bumpSeed,
          ]
      })
    }
  }

  /**
   * Fetch the obligation account bump seed, to pass to a wrap/unwrap instruction
   * @param TokenSymbol the string symbol to search for
   * @returns the bump seed as a number
   */
  static async getBumpSeed(TokenSymbol: SupportedTokens): Promise<number> {
    const seedString = `FLU:${TokenSymbol}_OBLIGATION`;
    const seedBuffer = Buffer.from(seedString, 'utf8');

    const [_, bump] = await PublicKey.findProgramAddress(
      [seedBuffer],
      new PublicKey(FLUID_PROGRAM_ID)
    );

    return bump;
  }
  
  /**
   * Fetch the obligation-derived PDA account
   * @param TokenSymbol the string symbol to search for
   * @returns the account 
   */
  static async getProgramAddress(TokenSymbol: SupportedTokens): Promise<PublicKey> {
    const seedString = `FLU:${TokenSymbol}_OBLIGATION`;
    const seedBuffer = Buffer.from(seedString, 'utf8');

    const [address] = await PublicKey.findProgramAddress(
      [seedBuffer],
      new PublicKey(FLUID_PROGRAM_ID)
    );

    return address;
  }
  // overwrite the encode method, since the inbuilt borsh serialisation doesn't seem to support
  // tuple enums (i.e. Wrap(u64, string, u8)). Instead, just overwrite them manually since we only
  // support two instructions.
  encode(this: FluidityInstruction & {Wrap?: [BN, string, number], Unwrap?: [BN, string, number]}): Buffer {
    const writer = new BinaryWriter();
    if (this.Wrap) {
      // if wrap 0, unwrap 1 (index in object)
      writer.writeU8(0);
      writer.writeU64(this.Wrap[0]);
      writer.writeString(this.Wrap[1]);
      writer.writeU8(this.Wrap[2]);
    } else if (this.Unwrap) {
      // if wrap 0, unwrap 1 (index in object)
      writer.writeU8(1);
      writer.writeU64(this.Unwrap[0]);
      writer.writeString(this.Unwrap[1]);
      writer.writeU8(this.Unwrap[2]);
    }
    return Buffer.from(writer.toArray());
  }
};
