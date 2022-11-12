import type { HighestRewardResponse } from "~/queries/useHighestRewardStatistics";

import { useNavigate } from "@remix-run/react";
import { useState } from "react";
import { json, LinksFunction, LoaderFunction } from "@remix-run/node";
import useViewport from "~/hooks/useViewport";
import { useHighestRewardStatisticsAll } from "~/queries/useHighestRewardStatistics";
import { format } from "date-fns";
import { networkMapper } from "~/util";
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
import Modal from "~/components/Modal";
import { captureException } from "@sentry/react";
import opportunityStyles from "~/styles/opportunity.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: opportunityStyles }];
};

export const loader: LoaderFunction = async () => {
  const { data, errors } = await useHighestRewardStatisticsAll();

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
  const [showChainDashboardModal, setShowChainDashboardModal] = useState(false);
  const [showChainOpportunityModal, setShowChainOpportunityModal] =
    useState(false);

  const navigate = useNavigate();

  const { highestRewards, highestWinner } = useLoaderData<LoaderData>();

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
        src={"/videos/FluidityOpportunityB.mp4"}
        type={"none"}
        loop={true}
      />
      <div className="index-page">
        {/* Navigation Buttons */}
        <div className="header-buttons">
          {/* Fluidity Website Button */}
          <a href="https://fluidity.money" rel="noopener noreferrer">
            <LinkButton
              size={"small"}
              type={"internal"}
              left={true}
              handleClick={() => {
                return;
              }}
            >
              {width < mobileBreakpoint ? "WEBSITE " : "FLUIDITY WEBSITE"}
            </LinkButton>
          </a>

          {/* Dashboard */}
          <LinkButton
            size={"small"}
            type={"internal"}
            handleClick={() => setShowChainDashboardModal(true)}
          >
            {width < mobileBreakpoint ? "APP" : "FLUIDITY APP"}
          </LinkButton>

          {/* Switch Chain Modal - Dashboard */}
          <Modal visible={showChainDashboardModal}>
            <BlockchainModal
              handleModal={setShowChainDashboardModal}
              option={{ name: "", icon: <div /> }}
              options={chains}
              setOption={(chain: string) =>
                navigate(`/${networkMapper(chain)}/dashboard/home`)
              }
              mobile={width <= mobileBreakpoint}
            />
          </Modal>
        </div>

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
                  size={width < mobileBreakpoint ? "lg" : "xl"}
                >
                  Connect your wallet to see what you could make.
                </Text>
              </div>

              <GeneralButton
                size="large"
                buttontype="text"
                version="primary"
                handleClick={() => {
                  setShowChainOpportunityModal(true);
                }}
              >
                MAKE IT RAIN
              </GeneralButton>
            </div>
          </div>

          {/* Switch Chain Modal - Opportunity */}
          <Modal visible={showChainOpportunityModal}>
            <BlockchainModal
              handleModal={setShowChainOpportunityModal}
              option={{ name: "", icon: <div /> }}
              options={chains}
              setOption={(chain: string) =>
                navigate(`/${networkMapper(chain)}`)
              }
              mobile={width <= mobileBreakpoint}
            />
          </Modal>

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
      </div>
    </>
  );
}

export { ErrorBoundary };
