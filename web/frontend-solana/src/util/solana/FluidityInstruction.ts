import {Enum as SolanaEnum, SOLANA_SCHEMA} from '@solana/web3.js';
import {TokenAmount} from "@saberhq/token-utils";
import BN from 'bn.js';
import {BinaryWriter} from 'borsh';
import {SupportedTokens} from 'components/types';

type FluidityInstructionCtor = {TokenSymbol: SupportedTokens} & ({Wrap: TokenAmount, Unwrap?: null} | {Wrap?: null, Unwrap: TokenAmount});

//Implements the Rust enum for wrapping and unwrapping a fluid asset
export class FluidityInstruction extends SolanaEnum {
  //we are targeting ES5, so opting for typescript's `private` keyword instead of using #updated
  private static updated = false;
  //pass an amount in base units (i.e. 1 = smallest )
  constructor(amount: FluidityInstructionCtor) {
    if (!FluidityInstruction.updated) {
        //update the schema once, so that we can serialise with borsh
        SOLANA_SCHEMA.set(FluidityInstruction, {
            kind: 'enum', 
            // fields:'struct', 
            field:'enum', 
            values: [
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
      super({[field]: [amount[field]?.toU64(), amount.TokenSymbol, 251]})
    } else {
      super({[field]: [amount[field], amount.TokenSymbol, 251]})
    }
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
