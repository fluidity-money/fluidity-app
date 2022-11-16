import type { Token } from "~/util/chainUtils/tokens";

import {
  GeneralButton,
  Text,
  numberToMonetaryString,
} from "@fluidity-money/surfing";
import { json, LoaderFunction } from "@remix-run/node";
import { useContext, useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { getTokenFromSymbol } from "~/util/chainUtils/tokens";
import config from "~/webapp.config.server";
import FluidityFacadeContext from "contexts/FluidityFacade";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { network, assetId } = params;

  if (!network) throw new Error("Network not found");
  if (!assetId) throw new Error("Asset not found");

  const {
    config: {
      [network as string]: { tokens },
    },
  } = config;

  const token = getTokenFromSymbol(network, assetId);
  if (!token) throw new Error(`Token ${assetId} not found`);

  const tokenIsFluid = !!token.isFluidOf;

  const tokenPair = tokenIsFluid
    ? tokens.find((t) => t.address === token.isFluidOf)
    : tokens.find((t) => t.isFluidOf === token.address);

  if (!tokenPair) throw new Error(`Token Pair of ${assetId} not found`);

  const url = new URL(request.url);
  const _amountStr = url.searchParams.get("amount");
  const _amountUnsafe = _amountStr ? parseInt(_amountStr) : 1;
  const amount = _amountUnsafe > 0 ? _amountUnsafe : 1;

  return json({
    network,
    tokenPair,
    token,
    amount,
  });
};

type LoaderData = {
  network: string;
  tokenPair: Token;
  token: Token;
  amount: number;
};

const TokenOut = () => {
  const { tokenPair, token, amount, network } = useLoaderData<LoaderData>();

  const { connected, balance } = useContext(FluidityFacadeContext);

  const navigate = useNavigate();

  const [walletBalance, setWalletBalance] = useState<number | undefined>();

  if (!connected) return navigate(`/`);

  useEffect(() => {
    if (network === "ethereum") {
      balance?.(token.address).then(setWalletBalance);
    }
  }, []);

  return (
    <div>
      {/* Overlapping Imgs */}
      <section>
        <img
          className="fluidify-circle"
          src="/images/fluidify/fluidify-hotspot.png"
        />
        <img src={token.logo} className="flu-token" />
      </section>

      <Text size="xl" prominent>
        {amount} {token.symbol} ({numberToMonetaryString(amount)}) created and
        added to your wallet.
      </Text>
      {walletBalance !== undefined && (
        <Text size="sm" prominent>
          {walletBalance} {tokenPair.symbol} (
          {numberToMonetaryString(walletBalance)}) remaining in your wallet..
        </Text>
      )}
      <GeneralButton
        buttontype="text"
        size="large"
        version="primary"
        handleClick={() => navigate("../../../../dashboard")}
      >
        Go to Dashboard
      </GeneralButton>
    </div>
  );
};

export default TokenOut;
