import { getUsdFromTokenAmount, Token } from "~/util/chainUtils/tokens";
import { LoaderFunction } from "@remix-run/node";
import serverConfig from "~/webapp.config.server";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { Suspense, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CollapsibleCard, TokenCard } from "@fluidity-money/surfing";
import { motion } from "framer-motion";
import BN from "bn.js";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { AugmentedToken } from "./index";

export const loader: LoaderFunction = async ({ params }) => {
  const { network } = params;
  const { tokens } = serverConfig.config[network as unknown as string] ?? {};

  const regularTokens = tokens.filter((token) => !token.isFluidOf);

  return {
    tokens: regularTokens,
  };
};

type LoaderData = {
  tokens: Token[];
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

  const [augmentedTokens, setAugmentedTokens] = useState<AugmentedToken[]>([])
  const [sortingStrategy, setSortingStrategy] = useState<'desc'>('desc');

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
  }, [tokens, balance])

  useEffect(() => {
    if (!balance) return

    fetchFluidAmtForTokens();
  }, [tokens, balance]);

  const sortedTokensMemoized = useMemo(() => {
    if (!augmentedTokens) return [];

    const sortedTokensCopy = [...augmentedTokens];

    if (sortingStrategy === 'desc') {
      sortedTokensCopy.sort((a, b) => {
        return b.usdAmount - a.usdAmount;
      });
    }

    return sortedTokensCopy;
  }, [augmentedTokens, sortingStrategy]);

  if (!balance) {
    return <></>
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

const CardWrapper: React.FC<{ token: Token }> = (props: { token: Token }) => {
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
            value={1}
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
