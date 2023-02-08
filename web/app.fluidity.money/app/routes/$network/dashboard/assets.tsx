import { Text, Display, Heading, ManualCarousel } from "@fluidity-money/surfing"
import { Link, Outlet, useLocation, useParams } from "@remix-run/react"
import ProviderCard from "~/components/ProviderCard"
import { useCache } from "~/hooks/useCache"
import { Rewarders } from "~/util/rewardAggregates"

import dashboardAssetsStyle from "~/styles/dashboard/assets.css";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";

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
                    { selected && <motion.div
                      className="assets-active-filter-underline"
                      layoutId="underline"
                    />}
                  </Link>
                );
              })}
            </div>
          </AnimateSharedLayout>
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