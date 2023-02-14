import {
  Text,
  Display,
  Heading,
  ManualCarousel,
  numberToMonetaryString,
} from "@fluidity-money/surfing";
import {
  Link,
  Outlet,
  useLoaderData,
  useLocation,
  useParams,
} from "@remix-run/react";
import ProviderCard from "~/components/ProviderCard";
import { useCache } from "~/hooks/useCache";
import { Rewarders } from "~/util/rewardAggregates";

import dashboardAssetsStyle from "~/styles/dashboard/assets.css";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { useContext, useEffect, useState } from "react";
import { LoaderFunction } from "@remix-run/node";

export const links = () => {
  return [{ rel: "stylesheet", href: dashboardAssetsStyle }];
};

import serverConfig from "~/webapp.config.server";
import { getUsdFromTokenAmount, Token } from "~/util/chainUtils/tokens";
import BN from "bn.js";
import { SplitContext } from "~/util/split";

export const loader: LoaderFunction = async ({ params }) => {
  const { network } = params;
  const { tokens } = serverConfig.config[network as unknown as string] ?? {};

  return {
    tokens,
  };
};

const getTotalValueOfAssetType = async (
  tokens: Token[],
  assetType: "fluid" | "regular",
  getBalance: (tokenAddr: string) => Promise<BN | undefined>
) => {
  const totalBalance = tokens.reduce(async (acc, token) => {
    if (assetType === "fluid" && !token.isFluidOf) return acc;
    if (assetType === "regular" && token.isFluidOf) return acc;

    const balance: BN | undefined = await getBalance(token.address);

    if (balance) {
      return (await acc) + getUsdFromTokenAmount(balance, token);
    }
    return acc;
  }, Promise.resolve(0));

  return totalBalance;
};

const AssetsRoot = () => {
  const { showExperiment, client } = useContext(SplitContext);

  const { network } = useParams();
  const { tokens } = useLoaderData();
  const urlRoot = `/${network}/dashboard/assets`;

  const currentPage = useLocation().pathname;

  const isFluidAssets = currentPage === urlRoot;

  const { data: rewarders } = useCache<Rewarders>(
    `/${network}/query/rewarders`
  );

  const { all: bestPerformingRewarders } = rewarders || { all: [] };

  const navigationMap = [
    {
      name: "Fluid Assets",
      link: urlRoot,
    },
    {
      name: "Regular Assets",
      link: `${urlRoot}/regular`,
    },
  ];

  const { connected, connecting, balance } = useContext(FluidityFacadeContext);

  const [totalWalletValue, setTotalWalletValue] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    if (!connected || !balance) return;

    (async () => {
      const total = await getTotalValueOfAssetType(
        tokens,
        isFluidAssets ? "fluid" : "regular",
        balance
      );
      setTotalWalletValue(total);
    })();
  }, [connected, isFluidAssets]);

  if (!showExperiment("enable-assets-page")) return (
    <div className="pad-main">Coming soon!</div>
  );

  return (
    <div className="pad-main">
      <div className="assets-header">
        <div className="assets-balance">
          <Text>
            Total balance of {isFluidAssets ? "Fluid" : "Regular"} Assets
          </Text>
          <Display size="sm">
            {numberToMonetaryString(totalWalletValue ?? 0)}
          </Display>
        </div>
        <AnimateSharedLayout>
          <div className="assets-navigation">
            {navigationMap.map((l, i) => {
              const selected = currentPage === l.link;
              return (
                <Link key={i} to={l.link}>
                  <Text
                    size="lg"
                    prominent={selected}
                    className={selected ? "assets-active-filter" : ""}
                  >
                    {l.name}
                  </Text>
                  {selected && (
                    <motion.div
                      className="assets-active-filter-underline"
                      layoutId="underline"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </AnimateSharedLayout>
      </div>
      <AnimatePresence>
        {showExperiment("enable-assets-page") ? (
          <Outlet />
        ) : (
          <div>Coming soon!</div>
        )}
        {/* {!connecting ? (connected ? <Outlet/> : <div>Looks like you haven&apos;t connected your wallet yet.</div>) : 'loading'} */}
      </AnimatePresence>
      <section id="rewarders">
        <Heading className="highest-rewarders" as={"h2"}>
          Highest Rewarders
        </Heading>
        <ManualCarousel scrollBar={true} className="rewards-carousel">
          {bestPerformingRewarders.map((rewarder) => (
            <div className="carousel-card-container" key={rewarder.name}>
              <ProviderCard
                name={rewarder.name}
                prize={rewarder.prize}
                avgPrize={rewarder.avgPrize}
                size="md"
              />
            </div>
          ))}
        </ManualCarousel>
      </section>
    </div>
  );
};

export default AssetsRoot;
