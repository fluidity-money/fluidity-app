import type { AssetLoaderData } from "../../query/dashboard/assets";

import FluidityFacadeContext from "contexts/FluidityFacade";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  CollapsibleCard,
  TokenCard,
  TokenDetails,
} from "@fluidity-money/surfing";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { Token } from "~/util/chainUtils/tokens";
import { LoaderFunction } from "@remix-run/node";
import serverConfig from "~/webapp.config.server";
import { useCache } from "~/hooks/useCache";
import BN from "bn.js";
import { motion } from "framer-motion";
import { getUsdFromTokenAmount } from "~/util/chainUtils/tokens";

export const loader: LoaderFunction = async ({ params }) => {
  const { network } = params;
  const { tokens } = serverConfig.config[network as unknown as string] ?? {};

  const fluidTokens = tokens.filter((t) => t.isFluidOf !== undefined);

  return {
    tokens: fluidTokens,
  };
};

type LoaderData = {
  tokens: Token[];
};

const allAssetsVariants = {
  hidden: {},
  visible: {
    x: 0,
    height: "auto",
    opacity: 1,
    transition: {
      duration: 1,
      staggerChildren: 0.1,
      staggerDirection: 1,
    },
  },
  exit: {
    x: -100,
  },
};

export type AugmentedToken = Token & {
  usdAmount: number;
};

const FluidAssets = () => {
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
      key={`fluid-assets-${sortedTokensMemoized}`}
      variants={allAssetsVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ minHeight: 750 }}
    >
      {sortedTokensMemoized.map((t, i) => {
        return <CardWrapper key={i} token={t} />;
      })}
    </motion.div>
  );
};

interface ICardWrapper {
  token: Token;
}

type Quantities = {
  fluidAmt: BN | undefined;
  regAmt: BN | undefined;
};

type Activity = {
  desc: string;
  value: number;
  reward: number;
  transaction: string;
  time: number;
};

type GraphActivity = {
  x: number;
  y: number;
}

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
    x: -200,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
}

const CardWrapper: React.FC<ICardWrapper> = (props: ICardWrapper) => {
  const { token } = props;

  const { network } = useParams();
  const { connected, balance, address } = useContext(FluidityFacadeContext);

  const [quantities, setQuantities] = useState<Quantities>({
    fluidAmt: new BN(0),
    regAmt: new BN(0),
  });

  const queryString = `/${network}/query/dashboard/assets?address=${address}&token=${token.symbol}`;

  const { data } = useCache<AssetLoaderData>(address ? queryString : '', true);

  const navigate = useNavigate();

  const regularContract = token.isFluidOf;

  if (!regularContract)
    throw new Error(`no regular contract for ${token.symbol}`);

  useEffect(() => {
    if (!connected) return;

    (async () => {
      const [fluidAmt, regAmt] = await Promise.all([
        balance?.(token.address),
        balance?.(regularContract),
      ]);

      setQuantities({
        fluidAmt: fluidAmt || new BN(0),
        regAmt: regAmt || new BN(0),
      });
    })();
  }, [connected]);

  if (!data) return <></>;

  const { topPrize, avgPrize, topAssetPrize, activity } = data;

  const graphData = useMemo(() => {
    const graphData: { y: number }[] = [];

    let accum = getUsdFromTokenAmount(
      quantities.fluidAmt || new BN(0),
      token.decimals
    )

    graphData.push({ y: accum })

    activity.forEach((a, i) => {
      a.desc === "Sent" ? accum += a.value : accum -= a.value
      accum -= a.reward
      accum = Math.round(accum * 100) / 100

      graphData.push({ y: accum })
    })

    return graphData.reverse().map((a, i) => ({ x: i, y: a.y }))
  }, [activity, quantities, token.decimals]);


  return (
    <motion.div style={{ marginBottom: "1em" }} variants={assetVariants}>
      <CollapsibleCard expanded={false}>
        <CollapsibleCard.Summary>
          <TokenCard
            isFluid
            showLabels
            token={token}
            fluidAmt={getUsdFromTokenAmount(
              quantities.fluidAmt || new BN(0),
              token.decimals
            )}
            regAmt={getUsdFromTokenAmount(
              quantities.regAmt || new BN(0),
              token.decimals
            )}
            value={1}
          />
        </CollapsibleCard.Summary>
        <CollapsibleCard.Details>
          <TokenDetails
            topPrize={{
              winning_amount: topPrize.winning_amount / 10 ** token.decimals,
              transaction_hash: topPrize.transaction_hash,
            }}
            avgPrize={avgPrize / 10 ** token.decimals}
            topAssetPrize={{
              winning_amount:
                topAssetPrize.winning_amount / 10 ** token.decimals,
              transaction_hash: topAssetPrize.transaction_hash,
            }}
            activity={activity}
            graphData={graphData}
            onClickFullHistory={() => navigate(`/${network}/dashboard/rewards`)}
          />
        </CollapsibleCard.Details>
      </CollapsibleCard>
    </motion.div>
  );
};

export default FluidAssets;
