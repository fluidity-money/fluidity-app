import type { Chain } from "~/util/chainUtils/chains";
import type { UserTransaction } from "~/queries/useUserTransactions";

import { useState } from "react";
import { LinksFunction, LoaderFunction, json, redirect } from "@remix-run/node";
import dashboardRewardsStyle from "~/styles/dashboard/rewards.css";
import useViewport from "~/hooks/useViewport";

import {
  Text,
  Heading,
  ManualCarousel,
  numberToMonetaryString,
} from "@fluidity-money/surfing";

import { useUserTransactionCount, useUserTransactions } from "~/queries";
import { useLoaderData } from "@remix-run/react";
import { ProviderCard, LabelledValue } from "~/components"

import TransactionTable from "~/screens/TransactionTable";
import UserRewards from "~/screens/UserRewards";
import NoUserRewards from "~/screens/NoUserRewards";

const address = "0xbb9cdbafba1137bdc28440f8f5fbed601a107bb6";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { network } = params;

  const url = new URL(request.url);
  const _pageStr = url.searchParams.get("page");
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const page = _pageUnsafe > 0 ? _pageUnsafe : 1;
  
  const {
    data: {
      [network as string]: {
        transfers: [{ count }],
      },
    },
  } = await (await useUserTransactionCount(address)).json();

  const {
    data: {
      [network as string]: { transfers: transactions },
    },
  } = await (await useUserTransactions(address, page)).json();
  
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
  
  // Get Best Rewarders
  

  return json({
    rewarders: rewarders,
    transactions: sanitizedTransactions,
    count,
    page,
    network,
  });
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: dashboardRewardsStyle }];
};

type Transaction = {
  sender: string;
  receiver: string;
  timestamp: number;
  value: number;
  currency: string;
};

type Rewarder = {
  iconUrl: string;
  name: string;
  prize: number;
  avgPrize: number;
}

type LoaderData = {
  transactions: Transaction[];
  count: number;
  page: number;
  rewarders: Rewarder[];
  network: Chain;
};

export default function Rewards() {
  const [ showBreakdown, setShowBreakdown ] = useState(false);
  const { transactions, count, page, rewarders, network } = useLoaderData<LoaderData>();
  
  const [ timeFrameIndex, setTimeFrameIndex ] = useState(0);
  
  const { width } = useViewport();
  const mobileView = width <= 375;
  
  const performanceTimeFrames = [
    "All time",
    "Last week",
    "Last month",
    "This year",
  ]
  
  return (
    <>
      <UserRewards claimNow={mobileView || showBreakdown} callback={() => setShowBreakdown(true)} />
      <NoUserRewards rewarder={rewarders[2]} />

      {/* Reward Performance */}
      <section id="performance">
        <Heading as={"h2"}>
          Reward Performance
        </Heading>
       <div className="graph-ceiling">
          <div className="overlay">
            <div className="statistics-row">
              <div className="statistics-set">
                <LabelledValue label={"Total claimed yield"}>
                  {numberToMonetaryString(29645)}
                </LabelledValue>
              </div>

              <div className="statistics-set">
                <LabelledValue label={"Highest performer"}>
                  fAVAX
                </LabelledValue>
              </div>

              <div className="statistics-set">
                <LabelledValue label={"Total prize pool"}>
                  {numberToMonetaryString(678120)}
                </LabelledValue>
              </div>

              <div className="statistics-set">
                <LabelledValue label={"Fluid Pairs"}>
                  {0}
                </LabelledValue>
              </div>
            </div>
          </div>
          <div>
            <div className="statistics-row">
              {performanceTimeFrames.map((timeFrame, i) => {
                const selectedProps = timeFrameIndex === i ? "selected" : ""
                const classProps = `${selectedProps}`

                return (
                  <Text className={classProps}>{timeFrame}</Text>
                )
              })}
            </div>
          </div>
        </div>
      </section>


      <section id="table">
        <TransactionTable
          page={page}
          count={count}
          transactions={transactions}
          chain={network}
        />
      </section>
    
      {/* Highest Rewarders */}
      <section id="rewarders">
        <Heading as={"h2"}>
          Highest Rewarders
        </Heading>
        <ManualCarousel scrollBar={true} >
          {rewarders.map(rewarder => 
            <ProviderCard 
              iconUrl={rewarder.iconUrl}
              name={rewarder.name}
              prize={rewarder.prize}
              avgPrize={rewarder.avgPrize}
            /> 
          )}
        </ManualCarousel>
        
      </section>
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
    prize: 351879,
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
]

