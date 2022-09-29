import { useState } from "react";
import { LinksFunction, LoaderFunction, json, redirect } from "@remix-run/node";
import dashboardRewardsStyle from "~/styles/dashboard/rewards.css";

import {
  GeneralButton,
  Display,
  Text,
  Heading,
  Card,
  ManualCarousel,
  numberToMonetaryString,
} from "@fluidity-money/surfing";

import { useUserTransactionCount, useUserTransactions } from "~/queries";
import { useLoaderData } from "@remix-run/react";
import { UserTransaction } from "~/queries/useUserTransactions";
import { ProviderCard, LabelledValue } from "~/components"

import { isYesterday, isToday, formatDistanceToNow, format } from "date-fns";

import { motion } from "framer-motion";

import { Table } from "~/components";

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

  return json({
    transactions: sanitizedTransactions,
    count,
    page,
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

type LoaderData = {
  transactions: Transaction[];
  count: number;
  page: number;
};

type Provider = {
  iconUrl: string;
  name: string;
  prize: number;
  avgPrize: number;
}

const TransactionRow = (tx: Transaction, index: number) => {
  const { sender, receiver, timestamp, value, currency } = tx;
  
  const isTransactionToday = isToday(timestamp * 1000);
  const isTransactionYesterday = isYesterday(timestamp * 1000);

  let timeLabel = "";

  if (isTransactionToday) {
    timeLabel = formatDistanceToNow(timestamp * 1000, {
      addSuffix: true,
    });
  } else if (isTransactionYesterday) {
    timeLabel = `Yesterday ${format(
      timestamp * 1000,
      "h:mmaaa"
    )}`;
  } else {
    timeLabel = format(timestamp * 1000, "dd.MM.yy h:mmaaa");
  }

  return (
    <motion.tr
      key={`${timestamp}-${index}`}
      variants={{
        enter: { opacity: [0, 1] },
        ready: { opacity: 1 },
        exit: { opacity: 0 },
        transitioning: {
          opacity: [0.75, 1, 0.75],
          transition: { duration: 1.5, repeat: Infinity },
        },
      }}
    >
      {/* Activity */}
      <td>
        <a>
          <Text>
            {currency} {ActivityLabel(tx, address)}
          </Text>
        </a>
      </td>

      {/* Value */}
      <td>
        <Text>
        {value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
        </Text>
      </td>

      {/* Reward */}
      <td>
        <Text prominent={true}>
          -
        </Text>
      </td>

      {/* Account */}
      <td>
        <a>
          <Text>
            {sender === address ? receiver : sender}
          </Text>
        </a>
      </td>

      {/* Time */}
      <td>{timeLabel}</td>
    </motion.tr>
  );
}

const ActivityLabel = (activity: Transaction, address: string) => {
  const { sender, currency } = activity;
  return sender === address ? `Sent ${currency}` : `Received ${currency}`;
};

const UserRewards = () => (
  <Card
    component="div"
    rounded={true}
    type={"holobox"}
  >
    <img src="./tokens" alt="tokens" />

    {/* Unclaimed fluid rewards */}
    <section>
      <Text size="md" >Unclaimed fluid rewards</Text>
      <Display size="md" >{numberToMonetaryString(6745)}</Display>
      <GeneralButton
        size={"large"}
        version={"primary"}
        buttonType="text"
        handleClick={() => {}}
      >
        View Breakdown
      </GeneralButton>
    </section>

    {/* Auto-claims infobox */}
    <section>
      <Heading as="h5">
        Auto-claims
      </Heading>
      <Text>
        {autoClaimInfo}
      </Text>
      <hr />
      <Heading as="h5">
        Instant-claim fees
      </Heading>
      <section>
        <Text>
          Network fee
        </Text>
        <Text>
          $0.002 FUSDC
        </Text>
      </section>
      <hr />
      <section>
        <Text>
          Gas fee
        </Text>
        <Text>
          $0.002 FUSDC
        </Text>
      </section>
      <hr />
    </section>
  </Card>
);

const NoUserRewards = ({rewarder} : {rewarder: Provider}) => (
  <div>
    <section>
      <Heading as="h2">
        Spend to earn
      </Heading>
      <Text prominent={true} size="lg">
        Use, send and receive fluid assets
        to generate yield.
      </Text>
    </section>
    <section>
      <Text size="md">
        Highest reward distribution this week
      </Text>

      <ProviderCard
        iconUrl={rewarder.iconUrl}
        name={rewarder.name}
        prize={rewarder.prize}
        avgPrize={rewarder.avgPrize}
      />
    </section>
  </div>
);



export default function Rewards() {
  const { transactions, count, page } = useLoaderData<LoaderData>();
  
  const [ timeFrameIndex, setTimeFrameIndex ] = useState(0);
  
  const performanceTimeFrames = [
    "All time",
    "Last week",
    "Last month",
    "This year",
  ]
  
  const txTableColumns = [
    {
      name: "ACTIVITY",
    },
    {
      name: "VALUE",
    },
    {
      name: "REWARD",
    },
    {
      name: "ACCOUNT",
    },
    {
      name: "TIME",
      alignRight: true,
    },
  ];
  
  return (
    <>
      <section id="user-rewards">
        <UserRewards />
        <NoUserRewards rewarder={rewarders[2]} />
      </section>

      {/* Reward Performance */}
      <section id="graph">
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
        <Table 
          itemName="transactions"
          headings={txTableColumns}
          pagination={{
            page: page,
            rowsPerPage: 12,
          }}
          count={count}
          data={transactions}
          renderRow={TransactionRow}
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

const autoClaimInfo = "Rewards will be claimed automatically, without fees\n\
                        when market volume is reached. Claiming before this\n\
                        time will incur instant-claim fees stated below."
