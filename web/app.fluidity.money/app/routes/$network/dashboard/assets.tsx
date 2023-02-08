import type { LoaderFunction } from "@remix-run/node";

import { json } from "@remix-run/node";
import { Text, Display, Heading, ManualCarousel, TabButton } from "@fluidity-money/surfing"
import { Link, Outlet, useLoaderData, useLocation, useParams } from "@remix-run/react"
import ProviderCard, { Provider } from "~/components/ProviderCard"
import { useCache } from "~/hooks/useCache"
import { Rewarders } from "~/util/rewardAggregates"

import dashboardAssetsStyle from "~/styles/dashboard/assets.css";
import { AnimatePresence } from "framer-motion";

export const links = () => {
  return [
    { rel: "stylesheet", href: dashboardAssetsStyle },
  ];
};

const AssetsRoot = () => {
    const { network } = useParams()
    
    const urlRoot = `/${network}/dashboard/assets`;

    const currentPage = useLocation().pathname;

    const isFluidAssets = currentPage === urlRoot;

    const {
      data: rewarders,
    } = useCache<Rewarders>(`/${network}/query/rewarders`)

    const {
      all: bestPerformingRewarders,
    } = rewarders || { all: [] }

    const navigationMap = [
      {
        name: "Fluid Assets",
        link: urlRoot,
      },
      {
        name: "Regular Assets",
        link: `${urlRoot}/regular`,
      },
    ]

    return (
      <div className="pad-main">
        <div className="assets-header">
          <div className="assets-balance">
              <Text>
                  Total balance
              </Text>
              <Display size="sm">
                  $0.00
              </Display>
          </div>
          <div className="assets-navigation">
            <Link to={urlRoot}>
              <Text
                size="lg"
                prominent={isFluidAssets}
                className={isFluidAssets ? "active-filter" : ""}
              >
                  Fluid Assets
              </Text>
            </Link>
            <Link to={`${urlRoot}/regular`}>
              <Text
                size="lg"
                prominent={!isFluidAssets}
                className={!isFluidAssets ? "active-filter" : ""}
              >
                  Regular Assets
              </Text>
            </Link>
          </div>
        </div>
        <AnimatePresence>
          <Outlet />
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
}

export default AssetsRoot;