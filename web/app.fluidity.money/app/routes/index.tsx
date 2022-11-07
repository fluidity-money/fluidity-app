import type { HighestRewardResponse } from "~/queries/useHighestRewardStatistics";

import { useNavigate } from "@remix-run/react";
import { useState, useEffect } from "react";
import { json, LinksFunction, LoaderFunction } from "@remix-run/node";
import useViewport from "~/hooks/useViewport";
import { useHighestRewardStatisticsAll } from "~/queries/useHighestRewardStatistics";
import { format } from "date-fns";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Display,
  GeneralButton,
  LinkButton,
  Text,
  LineChart,
  BlockchainModal,
  normaliseAddress,
  trimAddress,
  trimAddressShort,
  numberToMonetaryString,
  appendLeading0x,
} from "@fluidity-money/surfing";
import { useLoaderData } from "@remix-run/react";
import Video from "~/components/Video";
import { captureException } from "@sentry/react";
import opportunityStyles from "~/styles/opportunity.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: opportunityStyles }];
};

export const loader: LoaderFunction = async () => {
  const { data, errors } = await useHighestRewardStatisticsAll();
  console.log(data, errors);

  if (errors || !data) {
    captureException(new Error("Could not fetch historical Rewards"), {
      tags: {
        section: "opportunity",
      },
    });

    return json({
      highestRewards: [],
      winnerTotals: {},
      highestWinner: {},
    });
  }

  const highestRewards = data.highest_rewards_monthly.map((reward) => ({
    ...reward,
    awardedDate: new Date(reward.awarded_day),
  }));

  if (!Object.keys(data.highest_reward_winner_totals).length) {
    return json({
      highestRewards,
      winnerTotals: {},
      highestWinner: {},
    });
  }
  const winnerTotals: WinnerWinnings = data.highest_reward_winner_totals.reduce(
    (prev, current) => ({
      ...prev,
      [current.winning_address]: {
        transactionCount: current.transaction_count,
        totalWinnings: current.total_winnings,
      },
    }),
    {}
  );

  const largestWinnerEntries = Object.entries(winnerTotals).reduce(
    (largestWinner, winner) =>
      largestWinner[1].totalWinnings >= winner[1].totalWinnings
        ? largestWinner
        : winner
  );

  return json({
    highestRewards,
    winnerTotals,
    highestWinner: {
      address: largestWinnerEntries[0],
      totalWinnings: largestWinnerEntries[1].totalWinnings,
      transactionCount: largestWinnerEntries[1].transactionCount,
    },
  });
};

type WinnerWinnings = {
  [Address: string]: {
    transactionCount: number;
    totalWinnings: number;
  };
};

type HighestRewards =
  HighestRewardResponse["data"]["highest_rewards_monthly"] & {
    awardedDate: Date;
  };

type LoaderData = {
  winnerTotals: WinnerWinnings;
  highestRewards: HighestRewards;
  highestWinner: {
    address: string;
    totalWinnings: number;
    transactionCount: number;
  };
};

function ErrorBoundary() {
  return (
    <div
      style={{
        paddingTop: "40px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img src="/images/logoMetallic.png" alt="" style={{ height: "40px" }} />
      <h1>Could not load Highest Rewards</h1>
      <br />
      <h2>Our team has been notified, and are working on fixing it!</h2>
    </div>
  );
}

export default function IndexPage() {
  // on hover, use winnerTotals[hovered address]
  const [showChainModal, setShowChainModal] = useState(false);
  const [chain, setChain] = useState("");
  const { connected, publicKey, disconnect } = useWallet();
  const navigate = useNavigate();

  const networkMapper = (network: string) => {
    switch (network) {
      case "ETH":
        return "ethereum";
      case "SOL":
        return "solana";
      case "ethereum":
        return "ETH";
      default:
        return "SOL";
    }
  };

  const { highestRewards, winnerTotals, highestWinner } =
    useLoaderData<LoaderData>();

  const { width } = useViewport();
  const mobileBreakpoint = 500;

  const chains = [
    {
      name: "ETH",
      icon: <img src="/assets/chains/ethIcon.svg" />,
    },
    {
      name: "SOL",
      icon: <img src="/assets/chains/solanaIcon.svg" />,
    },
  ];

  return (
    <>
      <Video
        className="video"
        src={
          connected
            ? "/videos/FluidityOpportunityA.mp4"
            : "/videos/FluidityOpportunityB.mp4"
        }
        type={"none"}
        loop={true}
      />
      <div className="index-page">
        <div className="header-buttons">
          <a href="fluidity.money" rel="noopener noreferrer">
            <LinkButton
              size={"small"}
              type={"internal"}
              handleClick={() => {
                return;
              }}
            >
              {width < 500 && width > 0 ? "WEBSITE " : "FLUIDITY WEBSITE"}
            </LinkButton>
          </a>
          <LinkButton
            size={"small"}
            type={"internal"}
            handleClick={() => {
              return;
            }}
          >
            {width < 500 && width > 0 ? "APP" : "FLUIDITY APP"}
          </LinkButton>
        </div>
        {connected ? (
          <div className="connected">
            <div className="connected-content">
              <div className="connected-wallet">
                <div>{"(icon)"}</div>
                <Text>Wallet Address</Text>
              </div>
              <Display
                className="winnings-figure"
                size={width < 500 && width > 0 ? "xs" : "md"}
              >
                {"{$29,645.00}"}
              </Display>
              <Text size={width < 500 && width > 0 ? "md" : "xl"}>
                Would have been your winnings, based on your last 50
                transactions.
              </Text>
              <Text size={width < 500 && width > 0 ? "md" : "xl"}>
                Fluidify your assets to start earning.
              </Text>
              <div className="connected-buttons">
                <GeneralButton
                  size="large"
                  version="primary"
                  buttontype="text"
                  handleClick={() =>
                    navigate(`${networkMapper(chain)}/fluidify`)
                  }
                >
                  FLUIDIFY MONEY
                </GeneralButton>
                <GeneralButton
                  className="share-button"
                  size="large"
                  version="transparent"
                  buttontype="icon before"
                  icon={<img src="/images/socials/twitter.svg" />}
                  handleClick={() => {
                    return;
                  }}
                >
                  SHARE
                </GeneralButton>
              </div>
            </div>
          </div>
        ) : (
          <div className="disconnected">
            <div className="opportunity">
              <div className="opportunity-top"></div>
              <div className="opportunity-bottom">
                <div className="opportunity-text">
                  {/* Highest Winner */}
                  {highestWinner.address && (
                    <Display className="opportunity-text-top" size={"xs"}>
                      <Text>
                        <Text prominent>
                          {appendLeading0x(
                            trimAddressShort(
                              normaliseAddress(highestWinner.address)
                            )
                          )}
                        </Text>
                        {" claimed "}
                        <Text prominent>
                          {numberToMonetaryString(highestWinner.totalWinnings)}
                        </Text>
                        {` in fluid prizes over ${highestWinner.transactionCount} transactions.`}
                      </Text>
                    </Display>
                  )}

                  {/* Connect Wallet */}
                  <Text
                    className="connect-text"
                    size={width < 500 && width > 0 ? "lg" : "xl"}
                  >
                    Connect your wallet to see what you could make.
                  </Text>
                </div>

                <GeneralButton
                  size="large"
                  buttontype="text"
                  version="primary"
                  handleClick={() => {
                    setShowChainModal(true);
                  }}
                >
                  MAKE IT RAIN
                </GeneralButton>
              </div>
            </div>

            {showChainModal && (
              <BlockchainModal
                handleModal={showChainModal}
                option={{ name: chain, icon: <div /> }}
                options={chains}
                setOption={setChain}
                mobile={width <= mobileBreakpoint}
              />
            )}

            <div className="opportunity-graph">
              <LineChart
                data={highestRewards}
                lineLabel="transactions"
                accessors={{
                  xAccessor: (d: HighestRewards) => d.awardedDate,
                  yAccessor: (d: HighestRewards) => d.winning_amount_scaled,
                }}
                renderTooltip={({ datum }: { datum: HighestRewards }) => (
                  <div className={"tooltip"}>
                    <span style={{ color: "rgba(255,255,255, 50%)" }}>
                      {format(datum.awardedDate, "dd/mm/yy")}
                    </span>
                    <br />
                    <br />
                    <span>
                      <span>{trimAddress(datum.winning_address)}</span>
                    </span>
                    <br />
                    <br />
                    <span>
                      <span>
                        {numberToMonetaryString(datum.winning_amount_scaled)}{" "}
                      </span>
                      <span style={{ color: "rgba(2555,255,255, 50%)" }}>
                        prize awarded
                      </span>
                    </span>
                  </div>
                )}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export { ErrorBoundary };
