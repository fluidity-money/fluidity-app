import {BigintIsh, Token as SaberToken, TokenAmount} from '@saberhq/token-utils';
import {PublicKey} from '@solana/web3.js';
import {BaseToken} from '../types';

export class SolanaToken extends BaseToken{
  isFluid(): this is FluidSolanaToken {
    return this instanceof FluidSolanaToken;
  };

  isUnwrapped(): this is UnwrappedSolanaToken {
    return this instanceof UnwrappedSolanaToken;
  };

  // @saberhq/token-utils TokenAmount
  tokenAmount(amount: BigintIsh) {
    const {address, name, decimals, symbol} = this;
    return new TokenAmount(new SaberToken({
      chainId: -1,
      address,
      name,
      decimals,
      symbol,
    }), amount);
  }
}

// FluidSolanaToken has no special properties
export class FluidSolanaToken extends SolanaToken {};

// UnwrappedSolanaToken has the obligation and data accounts
export class UnwrappedSolanaToken extends SolanaToken {
  constructor(
    readonly symbol: string,
    readonly name: string,
    readonly address: string,
    readonly decimals: number,
    readonly colour: string,
    readonly image: string,
    readonly obligationAccount: PublicKey,
    readonly dataAccount: PublicKey,
  ) {
    super(symbol, name, address, decimals, colour, image);
  }
}
