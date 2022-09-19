// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE.md file.

import { UseSolana } from "@saberhq/use-solana";
import { PublicKey } from "@solana/web3.js";
import {getATAAddressSync} from "@saberhq/token-utils";
import * as splToken from "@solana/spl-token";
import { AccountMeta } from "@solana/web3.js";
import { FluidityInstruction } from "./FluidityInstruction";
import {Network} from "../../chainContext";
import {FluidSolanaToken, UnwrappedSolanaToken} from "./token";

const importSolendAddress = async(network: Network<"solana">) => {
  // nb these strings have to be inline, or vite can't optimise the dynamic import
  switch (network) {
    case "devnet":
      return await import("../solend/devnet-solend.json")
    case "mainnet-beta":
      return await import("../solend/mainnet-production-solend.json")
    default:
      throw new Error(`Invalid Solana network ${network}!`)
  }
}

// return the array of keys required to either wrap or unwrap fluid tokens
export const getFluidInstructionKeys = async(
  sol: UseSolana<any>,
  fluidProgramId: PublicKey,
  token: UnwrappedSolanaToken,
  fluidToken: FluidSolanaToken,
  ata: PublicKey, // user token ata
  fluidAta: PublicKey, //user fluid token ata
  network: Network<"solana">,
): Promise<Array<AccountMeta> | null> => {

  const {obligationAccount, dataAccount} = token;
  
  // assigns solendAddress based on network
  const solendAddress = await importSolendAddress(network);

  if (!sol.wallet || !sol.publicKey || !sol.connected || !sol.providerMut)
    return null;

  //pda token ata
  const pdaAccount = await FluidityInstruction.getProgramAddress(token.symbol, fluidProgramId);

  //find the solend asset and reserve
  const market = [...solendAddress.markets].find(({ name }) => name === "main");
  if (!market) return null;

  const reserve = market.reserves.find(({ asset }: { asset: string }) => asset === token.symbol);
  const solendAsset = solendAddress.oracles.assets.find(
    ({ asset }: { asset: string }) => asset === token.symbol
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
      pubkey: new PublicKey(obligationAccount),
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
