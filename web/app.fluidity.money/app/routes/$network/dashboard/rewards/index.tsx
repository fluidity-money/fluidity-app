import type { Provider } from "~/components/ProviderCard";
import type { Chain } from "~/util/chainUtils/chains";
import type { UserUnclaimedReward } from "~/queries/useUserUnclaimedRewards";
import type { UserTransaction } from "~/queries/useUserTransactions";
import config from "~/webapp.config.server";
import { LinksFunction, LoaderFunction, json, redirect } from "@remix-run/node";
import useViewport from "~/hooks/useViewport";
import {
  useUserTransactionCount,
  useUserTransactions,
  useUserUnclaimedRewards,
} from "~/queries";
import { useLoaderData } from "@remix-run/react";
import dashboardRewardsStyle from "~/styles/dashboard/rewards.css";

import { UserRewards } from "./common";
import {
  Text,
  Heading,
  numberToMonetaryString,
  ManualCarousel,
} from "@fluidity-money/surfing";
import { LabelledValue, ProviderCard, ProviderIcon } from "~/components";
import TransactionTable from "~/components/TransactionTable";
import useGlobalRewardStatistics from "~/queries/useGlobalRewardStatistics";
import { Providers } from "~/components/ProviderIcon";

const address = "bb004de25a81cb4ed6b2abd68bcc2693615b9e04";

export const loader: LoaderFunction = async ({ request, params }) => {
  const network = params.network ?? "";
  const icons = config.provider_icons;

  const networkFee = 0.002;
  const gasFee = 0.002;

  const url = new URL(request.url);
  const _pageStr = url.searchParams.get("page");
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const page = _pageUnsafe > 0 ? _pageUnsafe : 1;

  // Check address strips leading 0x
  const { data, error } = await useUserUnclaimedRewards(network, address);

  if (error || !data) {
    return redirect("/error", { status: 500, statusText: error });
  }

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

  let userTransactionCount;
  let userTransactions;
  let expectedRewards;
  let errorMsg;

  try {
    userTransactionCount = await (
      await useUserTransactionCount(network ?? "", address)
    ).json();
    userTransactions = await (
      await useUserTransactions(network ?? "", address, page)
    ).json();
    expectedRewards = await useGlobalRewardStatistics(network ?? "");
  } catch (err) {
    errorMsg = "The transaction explorer is currently unavailable";
  } // Fail silently - for now.

  if (errorMsg) {
    return redirect("/error", { status: 500, statusText: errorMsg });
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
  const rewarders = Object.values(aggregatedExpectedRewards || {});

  if (userTransactionCount.errors || userTransactions.errors) {
    return json({
      rewarders,
      transactions: [],
      count: 0,
      page,
      network,
      userUnclaimedRewards,
      fluidPairs: 8,
      networkFee,
      gasFee,
      icons,
    });
  }

  const {
    data: {
      [network as string]: {
        transfers: [{ count }],
      },
    },
  } = userTransactionCount;

  const {
    data: {
      [network as string]: { transfers: transactions },
    },
  } = userTransactions;

  // Destructure GraphQL data
  const sanitizedTransactions = transactions.map(
    (transaction: UserTransaction) => {
      const {
        sender: { address: sender },
        receiver: { address: receiver },
        block: {
          timestamp: { unixtime: timestamp },
        },
        amount: value,
        currency: { symbol: currency },
      } = transaction;

      return {
        sender,
        receiver,
        timestamp,
        value,
        currency,
      };
    }
  );

  if (Math.ceil(count / 12) < page && count > 0) {
    return redirect(`./`, 301);
  }

  // Get Best Rewarders - SCOPED OUT NO DATA

  return json({
    rewarders,
    transactions: sanitizedTransactions,
    count,
    page,
    network,
    userUnclaimedRewards: 6745,
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
  transactions: Transaction[];
  count: number;
  page: number;
  userUnclaimedRewards: number;
  rewarders: Provider[];
  network: Chain;
  fluidPairs: number;
  networkFee: number;
  gasFee: number;
};

export default function Rewards() {
  const {
    transactions,
    count,
    page,
    rewarders,
    network,
    fluidPairs,
    networkFee,
    gasFee,
    userUnclaimedRewards,
  } = useLoaderData<LoaderData>();

  const { width } = useViewport();
  const mobileView = width <= 375;

  const hasRewarders = rewarders.length > 0;

  const bestPerformingRewarders = rewarders.sort(
    ({ prize: prize_a }, { prize: prize_b }) => {
      if (prize_a > prize_b) return -1;
      if (prize_a === prize_b) return 0;
      return 1;
    }
  );

  return (
    <>
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
        <div className="noUserRewards">
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

      <Heading as={"h2"}>Reward Performance</Heading>
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
          address={address}
        />
      </section>

      {/* Highest Rewarders */}
      {hasRewarders && (
        <section id="rewarders">
          <Heading as={"h2"}>Highest Rewarders</Heading>
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
      )}
    </>
  );
}

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
