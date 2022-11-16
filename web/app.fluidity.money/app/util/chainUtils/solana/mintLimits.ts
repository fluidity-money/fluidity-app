import {jsonPost} from "~/util/api/rpc";
import {getCheckedSolContext} from "./instructions";

type UserMintLimitReq = {
  token_short_name: string;
};

type UserMintLimitRes = {
  mint_limit: number;
};

type UserAmountMintedReq = {
  address: string;
  token_short_name: string;
}

type UserAmountMintedRes = {
  amount_minted: number;
}

const userMintLimit = async (tokenName: string): Promise<UserMintLimitRes> => {
  const url = "https://backend.solana.fluidity.money";
  const body = {
    token_short_name: tokenName,
  };

  const response = await jsonPost<UserMintLimitReq, UserMintLimitRes>(url, body);

  return response;
};

const userAmountMinted = async (tokenName: string): Promise<UserAmountMintedRes> => {
  const solContext = getCheckedSolContext();

  if (solContext instanceof Error) {
    throw new Error(`Could not fetch limit: ${solContext}`);
  }

  const { publicKey } = solContext;

  const url = "https://backend.solana.fluidity.money";
  const body = {
    address: publicKey.toString(),
    token_short_name: tokenName,
  };

  const response = await jsonPost<UserAmountMintedReq, UserAmountMintedRes>(url, body);

  return response;
};

export {
  userMintLimit,
  userAmountMinted,
};
