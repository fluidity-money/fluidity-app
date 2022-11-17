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
  const { network } = params;

  if (!network) throw new Error("Network not found");

  const url = new URL(request.url);

  const assetId = url.searchParams.get("assetId");
  if (!assetId) throw new Error("Asset not found");

  const _amountStr = url.searchParams.get("amount");
  if (!_amountStr) throw new Error("Amount not found");
  const _amountUnsafe = _amountStr ? parseInt(_amountStr) : 1;
  const amount = _amountUnsafe > 0 ? _amountUnsafe : 1;

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

function ErrorBoundary(error: Error) {
  console.log(error);

  return (
    <div
      style={{
        paddingTop: "40px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img src="/images/logoMetallic.png" alt="" style={{ height: "40px" }} />
      <h1 style={{ textAlign: "center" }}>Could not find Token to Fluidify!</h1>
    </div>
  );
}

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

export { ErrorBoundary };
