import { json, LoaderFunction } from "@remix-run/node";

import { internalSwap } from "~/util/chainUtils/solana/instructions";

export const loader: LoaderFunction = async ({ params, request }) => {
  const { network } = params;

  if (network !== "solana") return new Error("Invalid Request");

  const url = new URL(request.url);
  const amount = url.searchParams.get("amount");
  const tokenAddr = url.searchParams.get("tokenAddr");

  if (!amount || !tokenAddr) return new Error("Invalid Request");

  return json({
    swapRes: await internalSwap(amount, tokenAddr),
  });
};
