import {UseSolana} from "@saberhq/use-solana";
import {PublicKey} from '@solana/web3.js';
import {getATAAddress, Token} from '@saberhq/token-utils';
import * as splToken from '@solana/spl-token';
import {BaseToken, tokenList} from "./constants";
import {AccountMeta} from '@solana/web3.js';
//https://github.com/solendprotocol/common/blob/master/src/devnet.json
//provides the accounts required for Solend interaction
import solendAddress from 'util/solendAddress.json';
//const accounts that we require
import accounts from 'util/accounts.json';
import {FluidityInstruction} from "./FluidityInstruction";
import {SupportedTokens} from "components/types";

// return the array of keys required to either wrap or unwrap fluid tokens
export const getFluidInstructionKeys = async (
  sol: UseSolana,
  token: Token,
  fluidToken: Token,
  ata: PublicKey, // user token ata
  fluidAta: PublicKey //user fluid token ata
): Promise<Array<AccountMeta> | null> => {

  if (!sol.wallet || !sol.publicKey || !sol.connected || !sol.providerMut)
    return null;

  //pda token ata
  const pdaAccount = await FluidityInstruction.getProgramAddress(token.symbol as SupportedTokens);

  //find the pre-existing data account for this token
  const dataAccount = accounts.dataAccounts.find(({asset}) => asset === token.symbol)
  if (!dataAccount)
    return null;

  //find the pre-existing obligation account for this token
  const obligationInfo = accounts.obligationInfo.find(({asset}) => asset === token.symbol)
  if (!obligationInfo)
    return null;

  //find the solend asset and reserve
  const market = solendAddress.markets.find(({name}) => name === "main");
  if (!market)
    return null;

  const reserve = market.reserves.find(({asset}) => asset === token.symbol);
  const solendAsset = solendAddress.oracles.assets.find(({asset}) => asset === token.symbol);
  if (!solendAsset || !reserve)
    return null;

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

  const pdaCollateral = await getATAAddress({
    mint: new PublicKey(reserveCollateralMintInfo),
    owner: new PublicKey(pdaAccount)
  });

  return [
    {
      //data account
      pubkey: new PublicKey(dataAccount.address),
      isSigner: false,
      isWritable: false,
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
      isWritable: true
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
      isWritable: true
    },
    {
      pubkey: new PublicKey(reserveInfo),
      isSigner: false,
      isWritable: true
    },
    {
      pubkey: new PublicKey(reserveLiquiditySupplyInfo),
      isSigner: false,
      isWritable: true
    },
    {
      pubkey: new PublicKey(reserveCollateralMintInfo),
      isSigner: false,
      isWritable: true
    },
    {
      pubkey: new PublicKey(lendingMarketInfo),
      isSigner: false,
      isWritable: true
    },
    {
      pubkey: new PublicKey(lendingMarketAuthorityInfo),
      isSigner: false,
      isWritable: false
    },
    {
      pubkey: new PublicKey(destinationCollateralInfo),
      isSigner: false,
      isWritable: true
    },
    {
      pubkey: new PublicKey(obligationInfo.address),
      isSigner: false,
      isWritable: true
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
      isWritable: false
    },
  ]
}

