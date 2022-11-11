import type { Provider } from "~/components/ProviderCard";
import type { Chain } from "~/util/chainUtils/chains";
import type { UserUnclaimedReward } from "~/queries/useUserUnclaimedRewards";

import { LinksFunction, LoaderFunction, json, redirect } from "@remix-run/node";
import config from "~/webapp.config.server";
import useViewport from "~/hooks/useViewport";
import { captureException } from "@sentry/react";
import { useUserUnclaimedRewards } from "~/queries";
import { useLoaderData } from "@remix-run/react";
import { UserRewards } from "./common";
import FluidityFacadeContext from "contexts/FluidityFacade";
import {
  Text,
  Heading,
  numberToMonetaryString,
  ManualCarousel,
} from "@fluidity-money/surfing";
import { useContext, useEffect, useState } from "react";
import { LabelledValue, ProviderCard, ProviderIcon } from "~/components";
import TransactionTable from "~/components/TransactionTable";
import useGlobalRewardStatistics from "~/queries/useGlobalRewardStatistics";
import { Providers } from "~/components/ProviderIcon";
import dashboardRewardsStyle from "~/styles/dashboard/rewards.css";

export const loader: LoaderFunction = async ({ request, params }) => {
  const network = params.network ?? "";
  const icons = config.provider_icons;

  const networkFee = 0.002;
  const gasFee = 0.002;

  const url = new URL(request.url);
  const _pageStr = url.searchParams.get("page");
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const page = _pageUnsafe > 0 ? _pageUnsafe : 1;

  let expectedRewards;
  let errorMsg;

  try {
    expectedRewards = await useGlobalRewardStatistics(network ?? "");
  } catch (err) {
    errorMsg = "The transaction explorer is currently unavailable";
  } // Fail silently - for now.

  if (errorMsg || !expectedRewards?.data) {
    //return redirect("/error", { status: 500, statusText: errorMsg });
    return json({
      icons,
      rewarders: [],
      page,
      network,
      fluidPairs: 8,
      networkFee,
      gasFee,
    });
  }

  // group rewards by backend
  const aggregatedExpectedRewards =
    expectedRewards?.data.expected_rewards.reduce((previous, currentReward) => {
      const {
        highest_reward: prize,
        average_reward: avgPrize,
        token_short_name,
      } = currentReward;
      const backend = backends[token_short_name];

      // append to backend if it exists
      if (previous[backend]) {
        previous[backend].avgPrize += avgPrize;
        // max prize
        previous[backend].prize = Math.max(previous[backend].prize, prize);
        // set backend if it doesn't exist
      } else {
        previous[backend] = {
          name: backend,
          prize,
          avgPrize,
        };
      }
      return previous;
    }, {} as { [K in Providers]: Provider });

  // convert to expected format
  const rewarders = Object.values(aggregatedExpectedRewards);

  return json({
    icons,
    rewarders,
    page,
    network,
    fluidPairs: 8,
    networkFee,
    gasFee,
  });
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: dashboardRewardsStyle }];
};

export type Transaction = {
  sender: string;
  receiver: string;
  timestamp: number;
  value: number;
  currency: string;
};

type LoaderData = {
  icons: { [provider: string]: string };
  rewarders: Provider[];
  page: number;
  network: Chain;
  fluidPairs: number;
  networkFee: number;
  gasFee: number;
};

function ErrorBoundary() {
  return (
    <div
      className="pad-main"
      style={{
        display: "flex",
        textAlign: "center",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img src="/images/logoMetallic.png" alt="" style={{ height: "40px" }} />
      <h1>Could not load User Rewards!</h1>
      <br />
      <h2>Our team has been notified, and are working on fixing it!</h2>
    </div>
  );
}

export default function Rewards() {
  const { page, fluidPairs, network, networkFee, gasFee, rewarders } =
    useLoaderData<LoaderData>();

  const { connected, address } = useContext(FluidityFacadeContext);

  const [
    { userUnclaimedRewards, transactions, count },
    setUnclaimedRewardsRes,
  ] = useState<{
    transactions: Transaction[];
    count: number;
    userUnclaimedRewards: number;
  }>({
    transactions: [],
    count: 0,
    userUnclaimedRewards: 0,
  });

  const { width } = useViewport();
  const mobileView = width <= 500;

  const hasRewarders = rewarders.length > 0;

  const bestPerformingRewarders = rewarders.sort(
    ({ prize: prize_a }, { prize: prize_b }) => {
      if (prize_a > prize_b) return -1;
      if (prize_a === prize_b) return 0;
      return 1;
    }
  );

  useEffect(() => {
    if (!connected || !address) return;

    // Get Unclaimed Rewards - Expect to fail if Solana
    (async () => {
      try {
        const { data, error } = await useUserUnclaimedRewards(
          network,
          address ?? ""
        );

        if (!data || error) return;

        const { ethereum_pending_winners: rewards } = data;

        const sanitisedRewards = rewards.filter(
          (transaction: UserUnclaimedReward) => !transaction.reward_sent
        );

        const userUnclaimedRewards = sanitisedRewards.reduce(
          (sum: number, transaction: UserUnclaimedReward) => {
            const { win_amount, token_decimals } = transaction;

            const decimals = 10 ** token_decimals;
            return sum + win_amount / decimals;
          },
          0
        );

        setUnclaimedRewardsRes({
          transactions,
          count,
          userUnclaimedRewards,
        });
      } catch (err) {
        captureException(
          new Error(
            `Could not fetch Transactions count for ${address}, on ${network}`
          ),
          {
            tags: {
              section: "dashboard",
            },
          }
        );
        return;
      }
    })();

    // Get Transaction History
    (async () => {
      try {
        const { transactions, count } = await (
          await fetch(
            `/${network}/query/userTransactions?network=${network}&address=${address}&page=${page}`
          )
        ).json();

        setUnclaimedRewardsRes({
          userUnclaimedRewards,
          transactions,
          count,
        });
      } catch (err) {
        captureException(
          new Error(
            `Could not fetch Transactions count for ${address}, on ${network}`
          ),
          {
            tags: {
              section: "dashboard",
            },
          }
        );
        return;
      } // Fail silently - for now.
    })();
  }, [connected, address]);

  return (
    <div className="pad-main">
      {/* Info Cards */}
      {userUnclaimedRewards > 0 ? (
        <UserRewards
          claimNow={mobileView}
          unclaimedRewards={userUnclaimedRewards}
          network={network}
          networkFee={networkFee}
          gasFee={gasFee}
        />
      ) : (
        <div className="no-user-rewards">
          <section id="spend-to-earn">
            <Heading className="spendToEarnHeading" as="h2">
              Spend to earn
            </Heading>
            <Text size="md">
              Use, send and receive fluid assets <br />
              to generate yield.
            </Text>
          </section>
          <section>
            <Text size="md">Highest reward distribution this week</Text>

            {hasRewarders && (
              <ProviderCard
                name={bestPerformingRewarders[0].name}
                prize={bestPerformingRewarders[0].prize}
                avgPrize={bestPerformingRewarders[0].avgPrize}
                size="lg"
              />
            )}
          </section>
        </div>
      )}
      <Heading className="reward-performance" as={mobileView ? "h3" : "h2"}>
        Reward Performance
      </Heading>
      {/* Reward Performance */}
      {hasRewarders && (
        <section id="performance">
          <div>
            <div>
              <div className="statistics-row">
                <div className="statistics-set">
                  <LabelledValue label={"Total claimed yield"}>
                    {numberToMonetaryString(29645)}
                  </LabelledValue>
                </div>

                <div className="statistics-set">
                  <LabelledValue label={"Highest performer"}>
                    <div className="highest-performer-child">
                      <ProviderIcon
                        provider={bestPerformingRewarders[0].name}
                      />
                      {bestPerformingRewarders[0].name}
                    </div>
                  </LabelledValue>
                </div>

                <div className="statistics-set">
                  <LabelledValue label={"Total prize pool"}>
                    {numberToMonetaryString(678120)}
                  </LabelledValue>
                </div>

                <div className="statistics-set">
                  <LabelledValue label={"Fluid Pairs"}>
                    {fluidPairs}
                  </LabelledValue>
                </div>
              </div>
            </div>
            <div>
              {/* scoped out */}
              {/* <div className="statistics-row">
                {performanceTimeFrames.map((timeFrame, i) => {
                  const selectedProps = timeFrameIndex === i ? "selected" : "";
                  const classProps = `${selectedProps}`;

                  return (
                    <button
                      key={timeFrame}
                      onClick={() => setTimeFrameIndex(i)}
                    >
                      <Text key={timeFrame + i} className={classProps}>
                        {timeFrame}
                      </Text>
                    </button>
                  );
                })}
              </div> */}
            </div>
          </div>
        </section>
      )}

      <section id="table">
        <TransactionTable
          page={page}
          count={count}
          transactions={transactions}
          chain={network}
          address={address ?? ""}
        />
      </section>

      {/* Highest Rewarders */}
      {hasRewarders && (
        <section id="rewarders">
          <Heading className="highest-rewarders" as={"h2"}>
            Highest Rewarders
          </Heading>
          {
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
          }
        </section>
      )}
    </div>
  );
}

export { ErrorBoundary };

// const rewarders: Provider[] = [
//   {
//     name: "Solana",
//     prize: 351879,
//     avgPrize: 1234,
//   },
//   {
//     name: "Polygon",
//     prize: 361879,
//     avgPrize: 1234,
//   },
//   {
//     name: "Compound",
//     prize: 351879,
//     avgPrize: 1234,
//   },
//   {
//     name: "Solana",
//     prize: 351879,
//     avgPrize: 1234,
//   },
//
// ];

const backends: { [Token: string]: Providers } = {
  USDC: "Compound",
  USDT: "Compound",
  DAI: "Compound",
};
