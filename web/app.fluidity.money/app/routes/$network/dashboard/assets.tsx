import { Text, Display, Heading, ManualCarousel } from "@fluidity-money/surfing"
import { Link, Outlet, useParams } from "@remix-run/react"
import ProviderCard, { Provider } from "~/components/ProviderCard"
import { useCache } from "~/hooks/useCache"
import { Rewarders } from "~/util/rewardAggregates"

import dashboardRewardsStyle from "~/styles/dashboard/rewards.css";

export const links = () => {
  return [
    { rel: "stylesheet", href: dashboardRewardsStyle },
  ];
};

const AssetsRoot = () => {
    const { network } = useParams()

    const urlRoot = `/${network}/dashboard/assets`;

    const {
      data: rewarders,
    } = useCache<Rewarders>(`/${network}/query/rewarders`)

    const {
      all: bestPerformingRewarders,
    } = rewarders || { all: [] }

    return <div className="pad-main">
        <>
            <Text>
                Total Balance
            </Text>
            <Display>
                $0.00
            </Display>
        </>
        <>
            <Link to={urlRoot}>
                Fluid Assets
            </Link>
            <Link to={`${urlRoot}/regular`}>
                Regular Assets
            </Link>
        </>
        <Outlet />
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
}

export default AssetsRoot;