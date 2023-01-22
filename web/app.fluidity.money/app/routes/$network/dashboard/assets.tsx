import type { LoaderFunction } from "@remix-run/node";

import { json } from "@remix-run/node";
import { Text, Display, Heading, ManualCarousel, TabButton } from "@fluidity-money/surfing"
import { Link, Outlet, useLoaderData } from "@remix-run/react"
import ProviderCard, { Provider } from "~/components/ProviderCard"
import { useCache } from "~/hooks/useCache"
import { Rewarders } from "~/util/rewardAggregates"

import dashboardAssetsStyle from "~/styles/dashboard/assets.css";

export const links = () => {
  return [
    { rel: "stylesheet", href: dashboardAssetsStyle },
  ];
};

export const loader: LoaderFunction = ( {request, params} ) => {
  const url = new URL(request.url);
  const urlPaths = url.pathname.split("/");
  const pathname = urlPaths.pop() ?? "";
  const showFluidToken = pathname === "assets";

  const { network } = params ?? "";

  
  return json({
    showFluidToken,
    network,
  })
}

type LoaderData = {
  showFluidToken: boolean,
  network: string,
}

const AssetsRoot = () => {
    const { network, showFluidToken } = useLoaderData<LoaderData>();

    const urlRoot = `/${network}/dashboard/assets`;

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
        <div>
          <>
              <Text>
                  Total Balance
              </Text>
              <Display size="sm">
                  $0.00
              </Display>
          </>
          <>
            <Link to={urlRoot}>
              <Text
                size="lg"
                prominent={showFluidToken}
                className={showFluidToken ? "active-filter" : ""}
              >
                  Fluid Assets
              </Text>
            </Link>
            <Link to={`${urlRoot}/regular`}>
              <Text
                size="lg"
                prominent={!showFluidToken}
                className={!showFluidToken ? "active-filter" : ""}
              >
                  Regular Assets
              </Text>
            </Link>
          </>
        </div>
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
  );
}

export default AssetsRoot;