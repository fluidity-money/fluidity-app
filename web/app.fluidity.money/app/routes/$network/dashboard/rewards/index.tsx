import type { Chain } from "~/util/chainUtils/chains";
import type { UserUnclaimedReward } from "~/queries/useUserUnclaimedRewards";
import type { UserTransaction } from "~/queries/useUserTransactions";

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
import { LabelledValue, ProviderCard } from "~/components";
import TransactionTable from "~/components/TransactionTable";

const address = "0xbb9cdbafba1137bdc28440f8f5fbed601a107bb6";

export const loader: LoaderFunction = async ({ request, params }) => {
  const network = params.network ?? "";

  const networkFee = 0.002;
  const gasFee = 0.002;

  const url = new URL(request.url);
  const _pageStr = url.searchParams.get("page");
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const page = _pageUnsafe > 0 ? _pageUnsafe : 1;

  let unclaimedRewards;
  let error;

  try {
    unclaimedRewards = await // Check address strips leading 0x
    (
      await useUserUnclaimedRewards(network, address)
    ).json();
  } catch (err) {
    error = "Could not fetch User Unclaimed Rewards";
  }

  if (error || unclaimedRewards.error) {
    return redirect("/error", { status: 500, statusText: error });
  }

  const {
    data: { ethereum_pending_winners: rewards },
  } = unclaimedRewards;

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

  try {
    userTransactionCount = await (
      await useUserTransactionCount(network ?? "", address)
    ).json();
    userTransactions = await (
      await useUserTransactions(network ?? "", address, page)
    ).json();
  } catch (err) {
    error = "The transaction explorer is currently unavailable";
  } // Fail silently - for now.

  if (error) {
    return redirect("/error", { status: 500, statusText: error });
  }

  if (userTransactionCount.errors || userTransactions.errors) {
    return json({
      rewarders: rewarders,
      transactions: [],
      count: 0,
      page,
      network,
      userUnclaimedRewards,
      fluidPairs: 8,
      networkFee,
      gasFee,
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
    rewarders: rewarders,
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

export type Rewarder = {
  iconUrl: string;
  name: string;
  prize: number;
  avgPrize: number;
};

type LoaderData = {
  transactions: Transaction[];
  count: number;
  page: number;
  userUnclaimedRewards: number;
  rewarders: Rewarder[];
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
                iconUrl={bestPerformingRewarders[0].iconUrl}
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
                    <img src={bestPerformingRewarders[0].iconUrl} alt="" />
                    {bestPerformingRewarders[0].name}
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
                  iconUrl={rewarder.iconUrl}
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

const rewarders = [
  {
    iconUrl: "./Solana.svg",
    name: "Solana",
    prize: 351879,
    avgPrize: 1234,
  },
  {
    iconUrl: "./Solana.svg",
    name: "Polygon",
    prize: 361879,
    avgPrize: 1234,
  },
  {
    iconUrl: "./Solana.svg",
    name: "Compound",
    prize: 351879,
    avgPrize: 1234,
  },
  {
    iconUrl: "./Solana.svg",
    name: "Solana",
    prize: 351879,
    avgPrize: 1234,
  },
];
