import type { Chain } from "~/util/chainUtils/chains";
import type { UserTransaction } from "~/routes/$network/query/userTransactions";
import type { Winner } from "~/queries/useUserRewards";
import type { IRow } from "~/components/Table";
import type Transaction from "~/types/Transaction";

import config from "~/webapp.config.server";
import { motion } from "framer-motion";
import { LinksFunction, LoaderFunction, json } from "@remix-run/node";
import { format } from "date-fns";
import { MintAddress } from "~/types/MintAddress";
import {
  Display,
  LineChart,
  Text,
  AnchorButton,
  LinkButton,
  trimAddress,
  numberToMonetaryString,
} from "@fluidity-money/surfing";
import useViewport from "~/hooks/useViewport";
import { useState, useContext, useMemo, useEffect } from "react";
import { useLoaderData, useNavigate, useLocation } from "@remix-run/react";
import { useUserRewardsAll } from "~/queries";
import { Table } from "~/components";
import {
  transactionActivityLabel,
  transactionTimeLabel,
  getAddressExplorerLink,
  getTxExplorerLink,
} from "~/util";
import FluidityFacadeContext from "contexts/FluidityFacade";
import dashboardHomeStyle from "~/styles/dashboard/home.css";

export const unstable_shouldReload = () => false;

export const loader: LoaderFunction = async ({ request, params }) => {
  const { network } = params;

  const url = new URL(request.url);
  const _pageStr = url.searchParams.get("page");
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const page = _pageUnsafe > 0 ? _pageUnsafe : 1;

  const fluidPairs = config.config[network ?? ""].fluidAssets.length;

  try {
    const {
      transactions,
      count,
    }: { transactions: UserTransaction[]; count: number } = await (
      await fetch(
        `${url.origin}/${network}/query/userTransactions?network=${network}&page=${page}`
      )
    ).json();

    const { data, errors } = await useUserRewardsAll(network ?? "");

    if (errors || !data) {
      throw errors;
    }

    const winnersMap = data.winners.reduce(
      (map, winner) => ({
        ...map,
        [winner.transaction_hash]: {
          ...winner,
        },
      }),
      {} as { [key: string]: Winner }
    );

    const {
      config: {
        [network as string]: { tokens },
      },
    } = config;

    const tokenLogoMap = tokens.reduce(
      (map, token) => ({
        ...map,
        [token.symbol]: token.logo,
      }),
      {} as Record<string, string>
    );

    const defaultLogo = "/assets/tokens/fUSDT.png";

    const mergedTransactions: Transaction[] =
      transactions?.map((tx) => {
        const winner = winnersMap[tx.hash];

        return {
          sender: tx.sender,
          receiver: tx.receiver,
          winner: winner?.winning_address ?? "",
          reward: winner
            ? winner.winning_amount / 10 ** winner.token_decimals
            : 0,
          hash: tx.hash,
          currency: tx.currency,
          value:
            tx.currency === "DAI" || tx.currency === "fDAI"
              ? tx.value / 10 ** 12
              : tx.value,
          timestamp: tx.timestamp * 1000,
          logo: tokenLogoMap[tx.currency] || defaultLogo,
          provider:
            (network === "ethereum"
              ? winner?.ethereum_application
              : winner?.solana_application) ?? "",
        };
      }) ?? [];

    const totalRewards = mergedTransactions.reduce(
      (sum, { reward }) => sum + reward,
      0
    );

    const totalVolume = mergedTransactions.reduce(
      (sum, { value }) => sum + value,
      0
    );

    return json({
      totalTransactions: mergedTransactions,
      totalCount: count,
      totalRewards,
      totalVolume,
      fluidPairs,
      page,
      network,
    });
  } catch (err) {
    console.log(err);
    throw new Error(`Could not fetch Transactions on ${network}: ${err}`);
  } // Fail silently - for now.
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: dashboardHomeStyle }];
};

export const meta = () => {
  return {
    title: "Dashboard",
  };
};

const graphEmptyTransaction = (time: number, value = 0): Transaction => ({
  sender: "",
  receiver: "",
  winner: "",
  reward: 0,
  hash: "",
  timestamp: time,
  value,
  currency: "",
  logo: "/assets/tokens/fUSDT.svg",
  provider: "",
});

type LoaderData = {
  totalTransactions: Transaction[];
  totalRewards: number;
  totalCount: number;
  totalVolume: number;
  fluidPairs: number;
  page: number;
  network: Chain;
};

function ErrorBoundary(error: Error) {
  console.log(error);
  return (
    <div
      className="pad-main"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img src="/images/logoMetallic.png" alt="" style={{ height: "40px" }} />
      <h1>Could not fetch transactions!</h1>
    </div>
  );
}

export default function Home() {
  const {
    network,
    totalTransactions,
    totalCount,
    totalRewards,
    totalVolume,
    fluidPairs,
  } = useLoaderData<LoaderData>();

  const location = useLocation();

  const pageRegex = /page=[0-9]+/gi;
  const _pageMatches = location.search.match(pageRegex);
  const _pageStr = _pageMatches?.length ? _pageMatches[0].split("=")[1] : "";
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const txTablePage = _pageUnsafe > 0 ? _pageUnsafe : 1;

  const navigate = useNavigate();

  const { address, connected } = useContext(FluidityFacadeContext);

  const [activeTransformerIndex, setActiveTransformerIndex] = useState(1);

  const [{ count, transactions, rewards, volume, graphTransformedTransactions }, setTransactions] = useState<{
    count: number;
    transactions: Transaction[];
    rewards: number;
    volume: number;
    graphTransformedTransactions: (Transaction & {x: number})[]
  }>({
    count: totalCount,
    transactions: totalTransactions,
    rewards: totalRewards,
    volume: totalVolume,
    graphTransformedTransactions: [],
  });

  const binTransactions = (
    bins: (Transaction & { x: number })[],
    txs: Transaction[]
  ): (Transaction & {x: number})[] => {
    const txMappedBins: (Transaction & {x: number})[][] = bins.map(bin => [bin]);
    
    let binIndex = 0;
    for (let txIndex = 0; txIndex < txs.length; txIndex++) {
      const tx = txs[txIndex];
      
      while (tx.timestamp < bins[binIndex].timestamp) {
        binIndex++;

        if (binIndex >= bins.length) break;
      }
      if (binIndex >= bins.length) break;
      
      txMappedBins[binIndex].push({...tx, x: bins[binIndex].x})
    }
    
    const maxTxMappedBins = txMappedBins.map(txs => txs.find((tx) => tx.value === Math.max(...txs.map(({value}) => value)))!).reverse();

    return maxTxMappedBins;
  };
  
  const graphTransformers = [
    {
      name: "D",
      transform: (txs: Transaction[]) => {
        const entries = 24;
        const unixHourInc = 60 * 60 * 1000;
        const unixNow = Date.now();

        const mappedTxBins = Array.from({ length: entries }).map((_, i) => ({
          ...graphEmptyTransaction(unixNow - (entries - i) * unixHourInc),
          x: i + 1,
        })).reverse();

        return binTransactions(mappedTxBins, txs);
      },
    },
    {
      name: "W",
      transform: (txs: Transaction[]) => {
        //const entries = 21;
        //const unixEightHourInc = 8 * 60 * 60 * 1000;
        const entries = 7;
        const unixEightHourInc = 24 * 60 * 60 * 1000;
        const unixNow = Date.now();

        const mappedTxBins = Array.from({ length: entries }).map((_, i) => ({
          ...graphEmptyTransaction(unixNow - (entries - i) * unixEightHourInc),
          x: i + 1,
        })).reverse();
        
        return binTransactions(mappedTxBins, txs);
      },
    },
    {
      name: "M",
      transform: (txs: Transaction[]) => {
        const entries = 30;
        const unixDayInc = 24 * 60 * 60 * 1000;
        const unixNow = Date.now();

        const mappedTxBins = Array.from({ length: entries }).map((_, i) => ({
          ...graphEmptyTransaction(unixNow - (entries - i) * unixDayInc),
          x: i + 1,
        })).reverse();

        return binTransactions(mappedTxBins, txs);
      },
    },
    {
      name: "Y",
      transform: (txs: Transaction[]) => {
        const entries = 12;
        const unixBimonthlyInc = 30 * 24 * 60 * 60 * 1000;
        const unixNow = Date.now();

        const mappedTxBins = Array.from({ length: entries }).map((_, i) => ({
          ...graphEmptyTransaction(unixNow - (entries - i) * unixBimonthlyInc),
          x: i + 1,
        })).reverse();

        return binTransactions(mappedTxBins, txs);
      },
    },
  ];

  const { width } = useViewport();
  const isTablet = width < 850 && width > 0;
  const isMobile = width < 500 && width > 0;
  const isSmallMobile = width < 375;

  const txTableColumns = isSmallMobile
    ? [{ name: "ACTIVITY" }, { name: "VALUE" }]
    : isMobile
    ? [{ name: "ACTIVITY" }, { name: "VALUE" }, { name: "ACCOUNT" }]
    : isTablet
    ? [
        { name: "ACTIVITY" },
        { name: "VALUE" },
        { name: "REWARD" },
        { name: "ACCOUNT" },
      ]
    : [
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

  const [activeTableFilterIndex, setActiveTableFilterIndex] = useState(
    connected ? 1 : 0
  );

  useEffect(() => {
    setActiveTableFilterIndex(connected ? 1 : 0);
  }, [connected]);

  const txTableFilters = address
    ? [
        {
          filter: () => true,
          name: "GLOBAL",
        },
        {
          filter: ({ sender, receiver }: Transaction) =>
            [sender, receiver].includes(address),
          name: "YOUR DASHBOARD",
        },
      ]
    : [
        {
          filter: () => true,
          name: "GLOBAL",
        },
      ];

  useEffect(() => {
    if (!activeTableFilterIndex) {
      return setTransactions({
        count: totalCount,
        rewards: totalRewards,
        transactions: totalTransactions,
        volume: totalVolume,
        graphTransformedTransactions: graphTransformers[activeTransformerIndex].transform(totalTransactions),
      });
    }

    const tableFilteredTransactions = totalTransactions.filter(
      txTableFilters[activeTableFilterIndex].filter
    );

    const filteredRewards = tableFilteredTransactions.reduce(
      (sum, { reward }) => sum + reward,
      0
    );

    const filteredVolume = tableFilteredTransactions.reduce(
      (sum, { value }) => sum + value,
      0
    );

    const graphTransformedTransactions = graphTransformers[activeTransformerIndex].transform(tableFilteredTransactions)


    setTransactions({
      count: tableFilteredTransactions.length,
      rewards: filteredRewards,
      volume: filteredVolume,
      transactions: tableFilteredTransactions,
      graphTransformedTransactions,
    });
  }, [activeTableFilterIndex, activeTransformerIndex]);

  const TransactionRow = (chain: Chain): IRow<Transaction> =>
    function Row({ data, index }: { data: Transaction; index: number }) {
      const { sender, timestamp, value, reward, hash, logo } = data;

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
            <a
              className="table-activity"
              href={getTxExplorerLink(network, hash)}
            >
              <img src={logo} />
              <Text>{transactionActivityLabel(data, sender)}</Text>
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
          {!isMobile && (
            <td>
              <Text prominent={true}>
                {reward ? numberToMonetaryString(reward) : "-"}
              </Text>
            </td>
          )}

          {/* Account */}
          {!isSmallMobile && (
            <td>
              <a
                className="table-address"
                href={getAddressExplorerLink(chain, sender)}
              >
                <Text>
                  {sender === MintAddress
                    ? "Mint Address"
                    : trimAddress(sender)}
                </Text>
              </a>
            </td>
          )}

          {/* Time */}
          {!isTablet && (
            <td>
              <Text>{transactionTimeLabel(timestamp)}</Text>
            </td>
          )}
        </motion.tr>
      );
    };

  return (
    <>
      <section id="graph">
        <div className="graph-ceiling pad-main">
          {/* Statistics */}
          <div className="overlay">
            <div className="totals-row">
              {/* Transactions Count */}
              <div className="statistics-set">
                <Text>
                  {activeTableFilterIndex ? "Your" : "Total"} transactions
                </Text>
                <Display
                  size={width < 300 && width > 0 ? "xxxs" : "xs"}
                  style={{ margin: 0 }}
                >
                  {count}
                </Display>
                <AnchorButton>
                  <a href="#transactions">Activity</a>
                </AnchorButton>
              </div>

              {/* Volume */}
              <div className="statistics-set">
                <Text>{activeTableFilterIndex ? "Your" : "Total"} volume</Text>
                <Display
                  size={width < 300 && width > 0 ? "xxxs" : "xs"}
                  style={{ margin: 0 }}
                >
                  {numberToMonetaryString(volume)}
                </Display>
              </div>

              {/* Rewards */}
              <div className="statistics-set">
                <Text>{activeTableFilterIndex ? "Your" : "Total"} yield</Text>
                <Display
                  size={width < 300 && width > 0 ? "xxxs" : "xs"}
                  style={{ margin: 0 }}
                >
                  {numberToMonetaryString(rewards)}
                </Display>
                <LinkButton
                  size="medium"
                  type="internal"
                  handleClick={() => {
                    navigate("../rewards");
                  }}
                >
                  Rewards
                </LinkButton>
              </div>

              {/* Fluid Pairs */}
              <div className="statistics-set">
                <Text>Fluid assets</Text>
                <Display
                  size={width < 300 && width > 0 ? "xxxs" : "xs"}
                  style={{ margin: 0 }}
                >
                  {fluidPairs}
                </Display>
              </div>
            </div>
          </div>

          {/* Graph Filter Row */}
          <div>
            <div className="statistics-row">
              {graphTransformers.map((filter, i) => (
                <button
                  key={`filter-${filter.name}`}
                  onClick={() => setActiveTransformerIndex(i)}
                >
                  <Text
                    size="xl"
                    prominent={activeTransformerIndex === i}
                    className={
                      activeTransformerIndex === i ? "active-filter" : ""
                    }
                  >
                    {filter.name}
                  </Text>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Graph */}
        <div className="graph" style={{ width: "100%", height: "400px" }}>
          <LineChart
            data={graphTransformedTransactions}
            lineLabel="transactions"
            accessors={{
              xAccessor: (d: Transaction & { x: number }) => d.x,
              yAccessor: (d: Transaction & { x: number }) => d.value,
            }}
            renderTooltip={({ datum }: { datum: Transaction }) => {
              return datum.value > 0 ? (
                <div className={"tooltip-container"}>
                  <div className={"tooltip"}>
                    <span style={{ color: "rgba(255,255,255, 50%)" }}>
                      {format(datum.timestamp, "dd/MM/yy")}
                    </span>
                    <br />
                    <br />
                    <span>
                  {datum.sender === MintAddress
                    ? "Mint Address"
                    : trimAddress(datum.sender)}
                    </span>
                    <br />
                    <br />
                    <span>
                      <span>{numberToMonetaryString(datum.value)} </span>
                      <span style={{ color: "rgba(2555,255,255, 50%)" }}>
                        swapped
                      </span>
                    </span>
                  </div>
                </div>
              ) : (
                <></>
              );
            }}
          />
        </div>
      </section>

      <section id="transactions" className="pad-main">
        <Table
          itemName="transactions"
          headings={txTableColumns}
          pagination={{
            page: txTablePage,
            rowsPerPage: 12,
          }}
          count={count}
          data={transactions}
          renderRow={TransactionRow(network)}
          onFilter={setActiveTableFilterIndex}
          activeFilterIndex={activeTableFilterIndex}
          filters={txTableFilters}
        />
      </section>
    </>
  );
}

export { ErrorBoundary };
