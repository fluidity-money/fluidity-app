import type { Token } from "~/util/chainUtils/tokens";

import { motion, AnimatePresence } from "framer-motion";
import { json, LoaderFunction } from "@remix-run/node";
import { useContext, useState, useEffect } from "react";
import { useLoaderData, useNavigate, Link } from "@remix-run/react";
import { getTokenFromSymbol } from "~/util/chainUtils/tokens";
import config, { colors } from "~/webapp.config.server";
import FluidityFacadeContext from "contexts/FluidityFacade";
import {
  GeneralButton,
  LinkButton,
  Heading,
  Text,
  numberToMonetaryString,
} from "@fluidity-money/surfing";
import BloomEffect from "~/components/BloomEffect";
import Video from "~/components/Video";

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

  const colorMap = (await colors)[network as string];

  return json({
    network,
    tokenPair,
    token,
    amount,
    colorMap,
  });
};

type LoaderData = {
  network: string;
  tokenPair: Token;
  token: Token;
  amount: number;
  colorMap: {
    [symbol: string]: string;
  };
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
  const { tokenPair, token, amount, network, colorMap } =
    useLoaderData<LoaderData>();

  const { connected, balance } = useContext(FluidityFacadeContext);

  const navigate = useNavigate();

  const [swapping, setSwapping] = useState(true);

  const [confirmed] = useState(true);

  const [walletBalance, setWalletBalance] = useState<number | undefined>();

  if (!connected) return navigate(`/`);

  useEffect(() => {
    if (network === "ethereum") {
      balance?.(token.address).then(setWalletBalance);
    }
  }, []);

  return (
    <div className="swap-complete-container">
      <div>
        <Link to={".."}>
          <LinkButton
            handleClick={() => {
              return;
            }}
            size="large"
            type="internal"
            left={true}
            className="cancel-btn"
          >
            Close
          </LinkButton>
        </Link>
      </div>
      <div className="swap-complete-modal-top">
        <BloomEffect
          type={"static"}
          color={colorMap[tokenPair.symbol] ?? "#fff"}
        />
        <img
          src={tokenPair?.logo}
          style={{
            aspectRatio: "1 / 1",
            height: "10%",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {swapping && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              exit={{ opacity: 0 }}
              className="video-container"
            >
              <Video
                className="swapping-video"
                src={"/videos/LoadingOther.webm"}
                loop={false}
                type="none"
                onEnded={() => {
                  setSwapping(false);
                }}
                playbackRate={1.5}
              />
            </motion.div>
          </AnimatePresence>
        )}

        {!swapping && (
          <img
            className="complete-fluidify-circle"
            src="/images/fluidify/fluidify-hotspot.png"
          />
        )}
      </div>

      {!swapping && (
        <div className="swap-complete-modal-content">
          {confirmed && (
            <>
              <Heading as="h5">
                {amount} {tokenPair.symbol} ({numberToMonetaryString(amount)})
                created and added to your wallet.
              </Heading>
              <Text>
                {walletBalance} {token.symbol} (
                {numberToMonetaryString(walletBalance || 0)}) remaining in
                wallet..
              </Text>
              <Link to="../../dashboard/home">
                <GeneralButton
                  buttontype="text"
                  size="large"
                  version="primary"
                  handleClick={() => {
                    return;
                  }}
                >
                  GO TO DASHBOARD
                </GeneralButton>
              </Link>
              <Link to="..">
                <LinkButton
                  type="internal"
                  size="medium"
                  handleClick={() => {
                    return;
                  }}
                >
                  FLUIDIFY MORE ASSETS
                </LinkButton>
              </Link>
            </>
          )}

          {!confirmed && (
            <>
              <Heading as="h5">
                {amount} {tokenPair.symbol} ({numberToMonetaryString(amount)})
                swapping and awaiting confirmation...
              </Heading>
              <Text>We&aposll notify you when it&aposs done!</Text>
              <Link to="../../dashboard/home">
                <GeneralButton
                  buttontype="text"
                  size="large"
                  version="primary"
                  handleClick={() => {
                    return;
                  }}
                >
                  GO TO DASHBOARD
                </GeneralButton>
              </Link>
              <Link to="..">
                <LinkButton
                  type="internal"
                  size="medium"
                  handleClick={() => {
                    return;
                  }}
                >
                  FLUIDIFY MORE ASSETS
                </LinkButton>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TokenOut;

export { ErrorBoundary };
