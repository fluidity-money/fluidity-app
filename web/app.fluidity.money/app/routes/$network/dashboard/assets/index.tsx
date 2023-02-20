import FluidityFacadeContext from "contexts/FluidityFacade";
import { useContext, useEffect, useState } from "react";
import {
  CollapsibleCard,
  TokenCard,
  TokenDetails,
} from "@fluidity-money/surfing";
import { useLoaderData, useParams } from "@remix-run/react";
import { Token } from "~/util/chainUtils/tokens";
import { LoaderFunction } from "@remix-run/node";
import serverConfig from "~/webapp.config.server";
import { useCache } from "~/hooks/useCache";
import BN from "bn.js";
import { ITokenStatistics } from "../../query/dashboard/assets";
import { motion } from "framer-motion";

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

const FluidAssets = () => {
  const { tokens } = useLoaderData<LoaderData>();

  return (
    <motion.div
      key="fluid-assets"
      variants={allAssetsVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {tokens.map((t, i) => {
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

type AugmentedActivity = Activity & {
  totalWalletValue: number;
};

const getAugmentedWalletActivity = (
  activity: Activity[],
  walletValue: number
): AugmentedActivity[] => {
  activity.sort((a, b) => a.time - b.time);

  return activity.map((a, i) => {
    const totalWalletValueDelta = activity
      .slice(0, i + 1)
      .reduce((acc, curr) => {
        return curr.desc === "Sent" ? acc - curr.value : acc + curr.value;
      }, walletValue);
    return {
      ...a,
      totalWalletValue: totalWalletValueDelta,
    };
  });
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
    x: -200,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

const CardWrapper: React.FC<ICardWrapper> = (props: ICardWrapper) => {
  const { token } = props;

  const { network } = useParams();
  const { connected, balance, address } = useContext(FluidityFacadeContext);

  const [quantities, setQuantities] = useState<Quantities>({
    fluidAmt: new BN(0),
    regAmt: new BN(0),
  });

  const regularContract = token.isFluidOf;

  if (!network) throw new Error("no network");
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

  const queryString = `/${network}/query/dashboard/assets?address=${address}&token=${token.symbol}`;

  const { data } = useCache<ITokenStatistics>(address ? queryString : "", true);

  if (!data) return <></>;

  const { topPrize, avgPrize, topAssetPrize, activity } = data;
  const decimals = new BN(10).pow(new BN(token.decimals));

  const augmentedActivity = getAugmentedWalletActivity(
    activity,
    quantities.fluidAmt?.div(decimals).toNumber() || 0
  );

  return (
    <motion.div style={{ marginBottom: "1em" }} variants={assetVariants}>
      <CollapsibleCard expanded={false}>
        <CollapsibleCard.Summary>
          <TokenCard
            isFluid
            showLabels
            token={token}
            fluidAmt={quantities.fluidAmt?.div(decimals).toNumber() || 0}
            regAmt={quantities.regAmt?.div(decimals).toNumber() || 0}
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
            activity={augmentedActivity}
          />
        </CollapsibleCard.Details>
      </CollapsibleCard>
    </motion.div>
  );
};

export default FluidAssets;
