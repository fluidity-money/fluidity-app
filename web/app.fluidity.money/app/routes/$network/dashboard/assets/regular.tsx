import { getUsdFromTokenAmount, Token } from "~/util/chainUtils/tokens";
import { LoaderFunction } from "@remix-run/node";
import serverConfig from "~/webapp.config.server";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CollapsibleCard, TokenCard } from "@fluidity-money/surfing";
import { motion } from "framer-motion";
import BN from "bn.js";
import FluidityFacadeContext from "contexts/FluidityFacade";
import config from "~/webapp.config.server";
import { JsonRpcProvider } from "@ethersproject/providers";
import { getWethUsdPrice } from "~/util/chainUtils/ethereum/transaction";
import EACAggregatorProxyAbi from "~/util/chainUtils/ethereum/EACAggregatorProxy.json";
import { Chain } from "~/util/chainUtils/chains";

const MAINNET_ID = 0;

export const loader: LoaderFunction = async ({ params }) => {
  const { network } = params;
  if (!network) throw new Error("Invalid Request");

  const { tokens } = serverConfig.config[network] ?? {};

  const infuraRpc = config.drivers[network][MAINNET_ID].rpc.http;
  const provider = new JsonRpcProvider(infuraRpc);

  const eacAggregatorProxyAddr =
    config.contract.eac_aggregator_proxy[network as Chain];

  const wethPrice = await getWethUsdPrice(
    provider,
    eacAggregatorProxyAddr,
    EACAggregatorProxyAbi
  );

  const regularTokens = tokens
    .filter((token) => !token.isFluidOf)
    .map((token) => ({
      ...token,
      price: token.symbol !== "wETH" ? 1 : wethPrice,
    }));

  return {
    tokens: regularTokens,
  };
};

type RegularToken = Token & {
  price: number;
};

export type AugmentedToken = RegularToken & {
  usdAmount: number;
};

type LoaderData = {
  tokens: RegularToken[];
};

export const ErrorBoundary: React.FC<{ error: Error }> = (props: {
  error: Error;
}) => {
  return (
    <div>
      <h1>Error</h1>
      <p>{props.error.message}</p>
      <p>The stack trace is:</p>
      <pre>{props.error.stack}</pre>
    </div>
  );
};

const allAssetsVariants = {
  hidden: {},
  visible: {
    left: 0,
    transition: {
      duration: 1,
      staggerChildren: 0.1,
      staggerDirection: 1,
    },
  },
  exit: {
    left: -100,
    opacity: 0,
    transition: {
      duration: 5,
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
};

const RegularAssets = () => {
  const { tokens } = useLoaderData<LoaderData>();

  const { balance } = useContext(FluidityFacadeContext);

  const [augmentedTokens, setAugmentedTokens] = useState<AugmentedToken[]>([]);
  const [sortingStrategy, setSortingStrategy] = useState<"desc">("desc");

  const fetchFluidAmtForTokens = useCallback(async () => {
    const tokensWithFluidAmt = await Promise.all(
      tokens.map(async (token) => {
        const fluidAmt = await balance?.(token.address);
        return {
          ...token,
          usdAmount: getUsdFromTokenAmount(fluidAmt || new BN(0), token),
        };
      })
    );

    setAugmentedTokens(tokensWithFluidAmt);
  }, [tokens, balance]);

  useEffect(() => {
    if (!balance) return;

    fetchFluidAmtForTokens();
  }, [tokens, balance]);

  const sortedTokensMemoized = useMemo(() => {
    if (!augmentedTokens) return [];

    const sortedTokensCopy = [...augmentedTokens];

    if (sortingStrategy === "desc") {
      sortedTokensCopy.sort((a, b) => {
        return b.usdAmount - a.usdAmount;
      });
    }

    return sortedTokensCopy;
  }, [augmentedTokens, sortingStrategy, setSortingStrategy]);

  if (!balance) {
    return <></>;
  }

  return (
    <motion.div
      key={`all-assets-${sortedTokensMemoized}`}
      variants={allAssetsVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ minHeight: 750 }}
    >
      <Suspense fallback={"loading"}>
        {sortedTokensMemoized.map((t, i) => {
          return <CardWrapper key={i} token={t} />;
        })}
      </Suspense>
    </motion.div>
  );
};

const assetVariants = {
  hidden: {
    opacity: 0,
    y: 100,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    y: 20,
  },
};

const CardWrapper: React.FC<{ token: RegularToken }> = (props: {
  token: RegularToken;
}) => {
  const { token } = props;
  const navigate = useNavigate();
  const { network } = useParams();

  const { connected, balance } = useContext(FluidityFacadeContext);

  const [amount, setAmount] = useState<BN>(new BN(0));

  useEffect(() => {
    if (!connected) return;

    (async () => {
      const amt = (await balance?.(token.address)) ?? new BN(0);
      setAmount(amt);
    })();
  }, [connected]);

  return (
    <motion.div variants={assetVariants} style={{ marginBottom: "1em" }}>
      <CollapsibleCard
        expanded={false}
        type="transparent"
        border="solid"
        color="gray"
      >
        <CollapsibleCard.Summary>
          <TokenCard
            showLabels
            token={token}
            regAmt={getUsdFromTokenAmount(amount, token.decimals)}
            value={token.price}
            onButtonPress={() =>
              navigate(`/${network}/fluidify?token=${token.symbol}`)
            }
          />
        </CollapsibleCard.Summary>
      </CollapsibleCard>
    </motion.div>
  );
};

export default RegularAssets;
