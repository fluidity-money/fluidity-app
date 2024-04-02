import { Chain, chainType } from "~/util/chainUtils/chains";
import type { IRow } from "~/components/Table";
import type Transaction from "~/types/Transaction";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import type { TransactionsLoaderData } from "../../query/userTransactions";
import type { RewardsLoaderData } from "../../query/dashboard/rewards";
import type { UnclaimedRewardsLoaderData } from "../../query/dashboard/unclaimedRewards";

import {
  transactionActivityLabel,
  transactionTimeLabel,
  getAddressExplorerLink,
  getTxExplorerLink,
} from "~/util";
import { json } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { UserRewards, NoUserRewards } from "./common";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { MintAddress } from "~/types/MintAddress";
import {
  Text,
  Heading,
  numberToMonetaryString,
  ManualCarousel,
  trimAddress,
  LinkButton,
  useViewport,
  LabelledValue,
  ProviderIcon,
  ProviderCard,
  Hoverable,
  TokenIcon,
  Provider,
  Token,
  CardCarousel,
  Display,
  WalletIcon,
  TabButton,
  toDecimalPlaces,
  LootBottle,
} from "@fluidity-money/surfing";
import { useContext, useEffect, useState, useMemo } from "react";
import { ToolTipContent, useToolTip, UtilityToken } from "~/components";
import { Table } from "~/components";
import dashboardRewardsStyle from "~/styles/dashboard/rewards.css";
import { useCache } from "~/hooks/useCache";
import { colors } from "~/webapp.config.server";
import { format } from "date-fns";
import { getProviderDisplayName } from "~/util/provider";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: dashboardRewardsStyle }];
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const { network } = params;

  const url = new URL(request.url);
  const _pageStr = url.searchParams.get("page");
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const txTablePage = _pageUnsafe > 0 ? _pageUnsafe : 1;
  const debug = url.searchParams.get("debug");

  return json({
    network,
    page: txTablePage,
    colors: (await colors)[network as string],
    debug,
  });
};

type LoaderData = {
  network: Chain;
  icons: { [provider: string]: string };
  page: number;
  colors: {
    [symbol: string]: string;
  };
  debug?: boolean;
};

function ErrorBoundary(error: Error) {
  console.error(error);
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

type CacheData = {
  rewards: RewardsLoaderData;
  transactions: TransactionsLoaderData;
  unclaimed: UnclaimedRewardsLoaderData;
};

const SAFE_DEFAULT_REWARDS: RewardsLoaderData = {
  // Only used in Rewards
  network: "arbitrum",
  fluidTokenMap: {},
  totalPrizePool: 0,
  loaded: false,
  fluidPairs: 0,
  networkFee: 0,
  gasFee: 0,
  timestamp: 0,
  rewarders: {
    week: [],
    month: [],
    year: [],
    all: [],
  },
  rewards: {
    day: [],
    week: [],
    month: [],
    year: [],
    all: [],
  },
  tokenPerformance: {
    week: [],
    month: [],
    year: [],
    all: [],
  },
};

const SAFE_DEFAULT_TRANSACTIONS: TransactionsLoaderData = {
  count: 0,
  page: 0,
  loaded: false,
  transactions: [],
};

const SAFE_DEFAULT_UNCLAIMED: UnclaimedRewardsLoaderData = {
  unclaimedTokenAddrs: [],
  userUnclaimedRewards: 0,
  loaded: false,
};

const ADJUSTED_BOTTLE_MULTIPLIER = 12;

export default function Rewards() {
  const { network, page, colors, debug } = useLoaderData<LoaderData>();

  const useDebug = debug;

  const { data: rewardsData } = useCache<RewardsLoaderData>(
    `/${network}/query/dashboard/rewards`
  );

  const isFirstLoad = !rewardsData;

  const { data: globalTransactionsData } = useCache<TransactionsLoaderData>(
    `/${network}/query/winningUserTransactions?page=${page}`
  );

  const { connected, address, tokens, addToken } = useContext(
    FluidityFacadeContext
  );

  const userRewardsData = useFetcher();

  const userTransactionsData = useFetcher();

  const userUnclaimedRewardsData = useFetcher();

  useEffect(() => {
    if (!address) return;

    userRewardsData.load(
      `/${network}/query/dashboard/rewards?address=${address}`
    );

    userTransactionsData.load(
      `/${network}/query/winningUserTransactions?page=${page}&address=${address}`
    );

    if (chainType(network) === "evm") {
      userUnclaimedRewardsData.load(
        `/${network}/query/dashboard/unclaimedRewards?address=${address}&page=${page}`
      );
    }
  }, [address, page]);

  const [userFluidPairs, setUserFluidPairs] = useState(
    SAFE_DEFAULT_REWARDS.fluidPairs
  );

  const data: { global: CacheData; user: CacheData } = {
    global: {
      rewards: {
        ...SAFE_DEFAULT_REWARDS,
        ...rewardsData,
      },
      transactions: {
        ...SAFE_DEFAULT_TRANSACTIONS,
        ...globalTransactionsData,
      },
      unclaimed: {
        ...SAFE_DEFAULT_UNCLAIMED,
      },
    },
    user: {
      rewards: {
        ...SAFE_DEFAULT_REWARDS,
        ...userRewardsData.data,
        fluidPairs: userFluidPairs,
      },
      transactions: {
        ...SAFE_DEFAULT_TRANSACTIONS,
        ...userTransactionsData.data,
      },
      unclaimed: {
        ...SAFE_DEFAULT_UNCLAIMED,
        ...userUnclaimedRewardsData.data,
      },
    },
  };

  useEffect(() => {
    if (!connected) return;

    (async () => {
      const fluidTokens = await tokens?.();

      setUserFluidPairs(fluidTokens?.length || 0);
    })();
  }, [connected]);

  const { width } = useViewport();
  const isMobile = width <= 500 && width > 0;

  const txTableColumns = useDebug
    ? [
        { name: "tx" },
        { name: "app" },
        { name: "utilities" },
        { name: "VALUE" },
        { name: "FLUID REWARDS" },
        { name: "time" },
      ]
    : [
        { name: "ACTIVITY" },
        { name: "VALUE" },
        { name: "FLUID REWARDS", show: width >= 500 },
        { name: "$UTILITY REWARDS", show: width >= 500 },
        { name: "BOTTLES EARNED", show: width >= 500 },
        { name: "WINNER", show: width >= 850 },
        { name: "REWARDED TIME", show: width >= 850, alignRight: true },
      ];

  const [activeTableFilterIndex, setActiveTableFilterIndex] = useState(0);

  const txTableFilters = address
    ? [
        {
          filter: () => true,
          name: "GLOBAL",
        },
        {
          filter: ({ sender, receiver }: Transaction) =>
            [sender, receiver].includes(address),
          name: "MY REWARDS",
        },
      ]
    : [
        {
          filter: () => true,
          name: "GLOBAL",
        },
      ];

  useEffect(() => {
    setActiveTableFilterIndex(connected ? 1 : 0);
  }, [connected]);

  const unixNow = Date.now();

  const [activeRewardFilterIndex, setActiveRewardFilterIndex] = useState(0);

  const rewardFilters = [
    {
      name: "All time",
      filter: () => true,
    },
    {
      name: "Last week",
      filter: ({ timestamp }: Transaction) =>
        timestamp > unixNow - 7 * 24 * 60 * 60 * 1000,
    },
    {
      name: "Last month",
      filter: ({ timestamp }: Transaction) =>
        timestamp > unixNow - 30 * 24 * 60 * 60 * 1000,
    },
    {
      name: "This year",
      filter: ({ timestamp }: Transaction) =>
        timestamp > unixNow - 365 * 24 * 60 * 60 * 1000,
    },
  ];

  // Filter Transactions via rewards filter / tx type filters
  const {
    count,
    hasRewarders,
    fluidPairs,
    transactions,
    rewarders,
    activeYield,
    totalPrizePool,
    timestamp,
    userUnclaimedRewards,
    txLoaded,
    hasTokenPerformance,
  } = useMemo(() => {
    const {
      rewards: rewardsData,
      transactions: txData,
      unclaimed,
    } = activeTableFilterIndex ? data.user : data.global;

    const {
      fluidPairs,
      networkFee,
      gasFee,
      totalPrizePool,
      timestamp,
      rewarders,
      loaded: rewardsLoaded,
      rewards,
      tokenPerformance,
    } = rewardsData;

    const { transactions, loaded: txLoaded } = txData;

    const {
      userUnclaimedRewards,
      unclaimedTokenAddrs,
      loaded: unclaimedLoaded,
    } = unclaimed;

    const {
      week: weeklyYield,
      month: monthlyYield,
      year: yearlyYield,
      all: allYield,
    } = rewards;

    const {
      week: weeklyRewards,
      month: monthlyRewards,
      year: yearlyRewards,
      all: allRewards,
    } = rewarders;

    const {
      week: weeklyTokenPerformance,
      month: monthlyTokenPerformance,
      year: yearlyTokenPerformance,
      all: allTokenPerformance,
    } = tokenPerformance;

    const [activeRewards, activeYield, activeTokenPerformance] = (() => {
      switch (activeRewardFilterIndex) {
        case 1:
          return [weeklyRewards, weeklyYield, weeklyTokenPerformance];
        case 2:
          return [monthlyRewards, monthlyYield, monthlyTokenPerformance];
        case 3:
          return [yearlyRewards, yearlyYield, yearlyTokenPerformance];
        case 0:
        default:
          return [allRewards, allYield, allTokenPerformance];
      }
    })();

    const hasRewarders = !!activeRewards.length;
    const hasTokenPerformance = !!activeTokenPerformance.length;

    return {
      count: allYield.length ? allYield[0].count : 0,
      hasRewarders,
      fluidPairs,
      networkFee,
      gasFee,
      transactions,
      rewarders: activeRewards,
      timestamp,
      activeYield: activeYield.length ? activeYield[0].total_reward : 0,
      totalPrizePool,
      userUnclaimedRewards,
      unclaimedTokenAddrs,
      weeklyRewards,
      rewardsLoaded,
      txLoaded,
      unclaimedLoaded,
      activeTokenPerformance,
      hasTokenPerformance,
    };
  }, [
    activeTableFilterIndex,
    activeRewardFilterIndex,
    rewardsData?.timestamp,
    globalTransactionsData?.page,
    userRewardsData.state,
    userTransactionsData.state,
    userUnclaimedRewardsData.state,
  ]);

  const transactionRow = (data: Transaction, chain: Chain): IRow => {
    const {
      winner,
      timestamp,
      value,
      reward,
      hash,
      rewardHash,
      logo,
      currency,
      utilityTokens,
      application,
      lootboxCount,
      rewardTier,
    } = data;

    const toolTip = useToolTip();

    const handleRewardTransactionClick = (
      network: Chain,
      currency: string,
      logo: string,
      hash: string
    ) => {
      hash && window.open(getTxExplorerLink(network, hash), "_blank");

      !hash &&
        toolTip.open(
          colors[currency as unknown as string],
          <ToolTipContent
            tokenLogoSrc={logo}
            boldTitle={``}
            details={"⏳ This reward claim is still pending! ⏳"}
          />
        );
    };

    const appProviderName = getProviderDisplayName(application);

    const shouldMultiplyBottles = application != "none";

    let adjustedLootboxCount = lootboxCount;
    if (shouldMultiplyBottles)
      adjustedLootboxCount = adjustedLootboxCount * ADJUSTED_BOTTLE_MULTIPLIER;

    return {
      RowElement: ({ heading }: { heading: string }) => {
        switch (heading) {
          case "ACTIVITY":
            return (
              <td>
                <a
                  className="table-activity"
                  href={getTxExplorerLink(network, hash)}
                >
                  {appProviderName !== "Fluidity" ? (
                    <ProviderIcon provider={appProviderName} />
                  ) : (
                    <TokenIcon token={currency} />
                  )}
                  <Text>{transactionActivityLabel(data, winner)}</Text>
                </a>
              </td>
            );
          case "VALUE":
            return (
              <td>
                <Text>
                  {value.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </Text>
              </td>
            );
          case "FLUID REWARDS":
            return (
              <td>
                {reward ? (
                  <a
                    className="table-address"
                    onClick={() =>
                      handleRewardTransactionClick(
                        network,
                        currency,
                        logo,
                        rewardHash
                      )
                    }
                  >
                    <Text prominent={true}>
                      {reward ? numberToMonetaryString(reward) : "-"}
                    </Text>
                  </a>
                ) : (
                  <Text>-</Text>
                )}
              </td>
            );
          case "$UTILITY REWARDS":
            return (
              <td>
                {utilityTokens && Object.keys(utilityTokens).length ? (
                  <a
                    onClick={() =>
                      handleRewardTransactionClick(
                        network,
                        currency,
                        logo,
                        rewardHash
                      )
                    }
                  >
                    {Object.entries(utilityTokens).map(([utility, utilAmt]) => (
                      <div key={utility} className="table-token">
                        <UtilityToken utility={utility} />
                        <Text>{toDecimalPlaces(utilAmt, 4)}</Text>
                      </div>
                    ))}
                  </a>
                ) : (
                  <Text>-</Text>
                )}
              </td>
            );
          case "BOTTLES EARNED":
            return (
              <td>
                {lootboxCount && rewardTier ? (
                  <a
                    className="table-address"
                    href={`/${network}/dashboard/airdrop`}
                  >
                    <LootBottle
                      size="sm"
                      rarity={rewardTier}
                      quantity={adjustedLootboxCount}
                    />
                    <Text>{toDecimalPlaces(adjustedLootboxCount, 4)}</Text>
                  </a>
                ) : (
                  <Text>-</Text>
                )}{" "}
              </td>
            );
          case "WINNER":
            return (
              <td>
                <a
                  className="table-address"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={getAddressExplorerLink(chain, winner)}
                >
                  <Text>
                    {winner === MintAddress
                      ? "Mint Address"
                      : trimAddress(winner)}
                  </Text>
                </a>
              </td>
            );
          case "REWARDED TIME":
            return (
              <td>
                <Text>{transactionTimeLabel(timestamp)}</Text>
              </td>
            );
          case "tx":
            return (
              <td>
                <a
                  className="table-activity"
                  href={getTxExplorerLink(network, hash)}
                >
                  <Text>{hash}</Text>
                </a>
              </td>
            );
          case "app":
            return (
              <td>
                <Text>{application}</Text>
              </td>
            );
          case "utilities":
            return (
              <td>{utilityTokens ? JSON.stringify(utilityTokens) : "none"}</td>
            );
          case "time":
            return <td>{timestamp}</td>;
          default:
            return <></>;
        }
      },
    };
  };

  const SpendToEarnCTA = () => {
    return (
      <CardCarousel
        size={isMobile ? "compact" : "normal"}
        type="transparent"
        color="white"
        fill
        border="solid"
      >
        <CardCarousel.Slide className={isMobile ? "compactSlide" : ""}>
          <div className={`rewards-cta-providers ${isMobile ? "compact" : ""}`}>
            <a
              onClick={(e) => {
                e?.stopPropagation();
                if (!connected || !addToken) return;

                addToken("fUSDC");
              }}
            >
              {/*<BloomEffect type="static" color={"#cf661d"} width={100} />*/}
              <WalletIcon wallet="metamask" />
            </a>
            <a href="https://app.1inch.io/#/1/simple/swap/ETH/0x9d1089802eE608BA84C5c98211afE5f37F96B36C/import-token">
              {/*<BloomEffect type="static" color={"red"} width={100} />*/}
              <ProviderIcon provider="Oneinch" />
            </a>
            <a href="https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0x9d1089802eE608BA84C5c98211afE5f37F96B36C&chainId=1">
              {/*<BloomEffect type="static" color={"#e65da9"} width={100} />*/}
              <ProviderIcon provider="Sushiswap" />
            </a>
            <a href="https://app.balancer.fi/#/ethereum/pool/0xfee6da6ce300197b7d613de22cb00e86a8537f06000200000000000000000393/invest">
              {/*<BloomEffect type="static" color={"#825902"} width={100} />*/}
              <ProviderIcon provider="Balancer" />
            </a>
          </div>
          <Display size="xxxs">Spend To Earn</Display>
          {!isMobile && <Text>Use Fluid Assets to generate yield.</Text>}
        </CardCarousel.Slide>
        <CardCarousel.Slide className={isMobile ? "compactSlide" : ""}>
          <div className={`rewards-cta-providers ${isMobile ? "compact" : ""}`}>
            {network == "arbitrum" ? (
              <>
                <a href="https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0x9d1089802eE608BA84C5c98211afE5f37F96B36C&chainId=1">
                  <ProviderIcon provider="Sushiswap" />
                </a>
                <a href="https://app.uniswap.org/#/swap?outputCurrency=0x9d1089802eE608BA84C5c98211afE5f37F96B36C">
                  <ProviderIcon provider="Uniswap" />
                </a>
                <a href="https://app.dodoex.io/?network=mainnet&from=0x9d1089802eE608BA84C5c98211afE5f37F96B36C&to=ETH">
                  <ProviderIcon provider="Dodo" />
                </a>
              </>
            ) : (
              <>
                <a href="https://www.meteora.ag/">
                  <ProviderIcon provider="Meteora" />
                </a>
                <a href="https://www.orca.so/">
                  <ProviderIcon provider="Orca" />
                </a>
                <a href="https://mercurial.finance">
                  <ProviderIcon provider="Mercurial" />
                </a>
                <a href="https://saber.so">
                  <ProviderIcon provider="Saber" />
                </a>
              </>
            )}
          </div>
          <Display size="xxxs">Swap To Earn</Display>
          {!isMobile && <Text>Swap Fluid Assets to generate yield.</Text>}
        </CardCarousel.Slide>
      </CardCarousel>
    );
  };

  return (
    <div className="pad-main">
      {/* Loading State */}
      <div style={{ marginBottom: "18px" }}>
        <Text>
          {isFirstLoad || !timestamp
            ? "Loading data..."
            : `Last updated: ${format(timestamp, "dd-MM-yyyy HH:mm:ss")}`}
        </Text>
      </div>

      {/* Info Cards */}
      <div className="reward-ctas">
        {!!userUnclaimedRewards && userUnclaimedRewards > 0.000005 ? (
          <UserRewards
            claimNow={false}
            unclaimedRewards={userUnclaimedRewards}
            claimedRewards={activeYield}
            network={network}
          />
        ) : (
          <>
            <NoUserRewards prizePool={totalPrizePool} />
            <SpendToEarnCTA />
          </>
        )}
      </div>

      {/* Heading & Filters */}
      <div className="reward-ceiling">
        <Heading className="reward-performance" as={isMobile ? "h3" : "h2"}>
          {activeTableFilterIndex ? "My" : "Global"} Reward Performance
        </Heading>

        <div className="filter-row">
          {rewardFilters.map((filter, i) => (
            <TabButton
              size="default"
              key={`filter-${filter.name}`}
              onClick={() => setActiveRewardFilterIndex(i)}
            >
              <Text
                prominent={activeRewardFilterIndex === i}
                className={activeRewardFilterIndex === i ? "active-filter" : ""}
              >
                {filter.name}
              </Text>
            </TabButton>
          ))}
        </div>
      </div>

      {/* Reward Performance */}
      <section id="performance">
        <div className="statistics-row">
          <div className="statistics-set">
            <LabelledValue
              label={`${activeTableFilterIndex ? "My" : "Total"} claimed yield`}
            >
              {numberToMonetaryString(activeYield)}
            </LabelledValue>
          </div>

          {hasTokenPerformance && (
            <div className="statistics-set">
              <LabelledValue
                label={"Highest performer"}
                icon={<TokenIcon token={`fUSDC` as Token} />}
              >
                {`fUSDC` as Token}
              </LabelledValue>
            </div>
          )}

          <div className="statistics-set">
            <LabelledValue label={"Fluid Pairs"}>{fluidPairs}</LabelledValue>
            <Link to={`/${network}/fluidify`}>
              <LinkButton
                size="medium"
                type="internal"
                handleClick={() => {
                  return;
                }}
              >
                Create Assets
              </LinkButton>
            </Link>
          </div>

          {hasRewarders && (
            <div className="statistics-set">
              <LabelledValue
                label={"Highest Reward Distribution"}
                icon={
                  <ProviderIcon provider={rewarders[0]?.name as Provider} />
                }
              >
                {rewarders[0]?.name === "Fluidity"
                  ? "Transacting ƒAssets"
                  : rewarders[0]?.name}
              </LabelledValue>
              <Hoverable
                tooltipContent={
                  <>
                    <ProviderIcon
                      provider={rewarders[0]?.name}
                      className="hover-provider-icon"
                    />
                    <Display
                      size="xxxs"
                      style={{ whiteSpace: "nowrap", marginBottom: 12 }}
                    >
                      {rewarders[0]?.name === "Fluidity"
                        ? "Transacting ƒAssets"
                        : rewarders[0]?.name}
                    </Display>
                    <Text>
                      Fluidity wraps assets into fluid assets and generates
                      yield every time fluid assets are used.
                    </Text>
                    <div className="hover-prizes" style={{ marginTop: 12 }}>
                      <div className="hover-prize-value">
                        <Text prominent>
                          {numberToMonetaryString(rewarders[0].avgPrize)}
                        </Text>
                        <Text>Avg prize/trans</Text>
                      </div>
                      <div className="hover-prize-value">
                        <Text prominent>
                          {numberToMonetaryString(rewarders[0].prize)}
                        </Text>
                        <Text>Top prize</Text>
                      </div>
                    </div>
                  </>
                }
              >
                <LinkButton
                  size="medium"
                  type="info"
                  handleClick={() => {
                    return;
                  }}
                >
                  Hover for Details
                </LinkButton>
              </Hoverable>
            </div>
          )}
        </div>
      </section>

      <section id="table">
        <Table
          itemName="rewards"
          headings={txTableColumns}
          pagination={{
            page,
            rowsPerPage: 12,
          }}
          count={count}
          data={transactions}
          renderRow={(data) => transactionRow(data, network)}
          filters={txTableFilters}
          onFilter={setActiveTableFilterIndex}
          activeFilterIndex={activeTableFilterIndex}
          loaded={txLoaded}
          showLoadingAnimation={true}
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
              {rewarders.map((rewarder) => (
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
