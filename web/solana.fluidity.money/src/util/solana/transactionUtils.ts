// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { UseSolana } from "@saberhq/use-solana";
import { PublicKey } from "@solana/web3.js";
import { getATAAddressSync, Token } from "@saberhq/token-utils";
import * as splToken from "@solana/spl-token";
import { AccountMeta } from "@solana/web3.js";
//https://github.com/solendprotocol/common/blob/master/src/devnet.json
//provides the accounts required for Solend interaction
import devnetSolendAddress from "util/solend/devnet-solend.json";
import mainnetSolendAddress from "util/solend/mainnet-production-solend.json";
import { FluidityInstruction } from "./FluidityInstruction";
import { SupportedTokens } from "components/types";

// return the array of keys required to either wrap or unwrap fluid tokens
export const getFluidInstructionKeys = async (
  sol: UseSolana<any>,
  token: Token,
  fluidToken: Token,
  ata: PublicKey, // user token ata
  fluidAta: PublicKey, //user fluid token ata
  obligationInfo: PublicKey,
  dataAccount: PublicKey,
): Promise<Array<AccountMeta> | null> => {
  // assigns solendAddress based on network
  const solendAddress =
    process.env.REACT_APP_SOL_NETWORK === "mainnet"
      ? mainnetSolendAddress
      : process.env.REACT_APP_SOL_NETWORK === "devnet"
      ? devnetSolendAddress
      : devnetSolendAddress;

  if (!sol.wallet || !sol.publicKey || !sol.connected || !sol.providerMut)
    return null;

  //pda token ata
  const pdaAccount = await FluidityInstruction.getProgramAddress(
    token.symbol as SupportedTokens
  );

  //find the solend asset and reserve
  const market = [...solendAddress.markets].find(({ name }) => name === "main");
  if (!market) return null;

  const reserve = market.reserves.find(({ asset }) => asset === token.symbol);
  const solendAsset = solendAddress.oracles.assets.find(
    ({ asset }) => asset === token.symbol
  );
  if (!solendAsset || !reserve) return null;

  // obtain the necessary accounts for both instructions
  const solendProgram = solendAddress.programID;
  const reserveInfo = reserve.address;
  const reserveLiquiditySupplyInfo = reserve.liquidityAddress;
  const reserveCollateralMintInfo = reserve.collateralMintAddress;
  const lendingMarketInfo = market.address;
  const lendingMarketAuthorityInfo = market.authorityAddress;
  const destinationCollateralInfo = reserve.collateralSupplyAddress;
  const pythPriceInfo = solendAsset.priceAddress;
  const switchboardFeedInfo = solendAsset.switchboardFeedAddress;
  const clock = "SysvarC1ock11111111111111111111111111111111";

  const pdaCollateral = getATAAddressSync({
    mint: new PublicKey(reserveCollateralMintInfo),
    owner: new PublicKey(pdaAccount),
  });

  return [
    {
      //data account
      pubkey: new PublicKey(dataAccount),
      isSigner: false,
      isWritable: true,
    },
    {
      //token program
      pubkey: splToken.TOKEN_PROGRAM_ID,
      isSigner: false,
      isWritable: false,
    },
    {
      //base token mint address
      pubkey: new PublicKey(token.address),
      isSigner: false,
      isWritable: true,
    },
    {
      //fluid token mint address
      pubkey: new PublicKey(fluidToken.address),
      isSigner: false,
      isWritable: true,
    },
    {
      //PDA account
      pubkey: new PublicKey(pdaAccount),
      isSigner: false,
      isWritable: true,
    },
    {
      //payer (user)
      pubkey: sol.publicKey,
      isSigner: true,
      isWritable: true,
    },
    {
      //user token account
      pubkey: ata,
      isSigner: false,
      isWritable: true,
    },
    {
      //user fluid token account
      pubkey: fluidAta,
      isSigner: false,
      isWritable: true,
    },
    {
      //solend program
      pubkey: new PublicKey(solendProgram),
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: new PublicKey(pdaCollateral),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: new PublicKey(reserveInfo),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: new PublicKey(reserveLiquiditySupplyInfo),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: new PublicKey(reserveCollateralMintInfo),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: new PublicKey(lendingMarketInfo),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: new PublicKey(lendingMarketAuthorityInfo),
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: new PublicKey(destinationCollateralInfo),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: new PublicKey(obligationInfo),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: new PublicKey(pythPriceInfo),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: new PublicKey(switchboardFeedInfo),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: new PublicKey(clock),
      isSigner: false,
      isWritable: false,
    },
  ];
};
