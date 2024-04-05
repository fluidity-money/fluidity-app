import type { HighestRewardMonthly } from "~/queries/useHighestRewardStatistics";

import { useNavigate } from "@remix-run/react";
import { useState } from "react";
import {
  json,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { useHighestRewardStatisticsAll } from "~/queries/useHighestRewardStatistics";
import { format, parseISO } from "date-fns";
import { getAddressExplorerLink, networkMapper } from "~/util";
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
  Video,
  useViewport,
  Modal,
  Tooltip,
} from "@fluidity-money/surfing";
import { useLoaderData } from "@remix-run/react";
import { captureException } from "@sentry/react";
import opportunityStyles from "~/styles/opportunity.css";
import { Chain } from "~/util/chainUtils/chains";
import { generateMeta } from "~/util/tweeter";
import { MintAddress } from "~/types/MintAddress";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: opportunityStyles }];
};

const enabledChains = [
  {
    name: "ETH",
    icon: <img src="https://app-cdn.fluidity.money/assets/chains/ethIcon.svg" />,
  },
  {
    name: "ARB",
    icon: <img src="https://app-cdn.fluidity.money/assets/chains/arbIcon.svg" />,
  },
  {
    name: "SOL",
    icon: <img src="https://app-cdn.fluidity.money/assets/chains/solanaIcon.svg" />,
  },
];

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

  const highestRewards = data.highest_rewards_monthly;

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
        network: current.network,
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
      network: largestWinnerEntries[1].network,
      totalWinnings: largestWinnerEntries[1].totalWinnings,
      transactionCount: largestWinnerEntries[1].transactionCount,
    },
  });
};

export const meta: MetaFunction = ({ location }) => {
  const reActionQuery = /action=[\w]*/;
  const queryString = location.search;
  const actionString = queryString.match(reActionQuery)?.[0];
  const action = actionString?.split("=")[1];

  return generateMeta(action ?? "");
};

type WinnerWinnings = {
  [Address: string]: {
    network: string;
    transactionCount: number;
    totalWinnings: number;
  };
};

type LoaderData = {
  winnerTotals: WinnerWinnings;
  highestRewards: HighestRewardMonthly[];
  highestWinner: {
    address: string;
    network: string;
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
      <img src="https://app-cdn.fluidity.money/images/logoMetallic.png" alt="" style={{ height: "40px" }} />
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

  return (
    <>
      <Video
        className="video"
        src={"https://app-cdn.fluidity.money/videos/FluidityOpportunityB.mp4"}
        type={"none"}
        loop={true}
      />

      <div className="index-page">
        {/* Bg Line Chart */}
        <div
          className="opportunity-graph"
          style={{
            width: "100%",
            height: "400px",
            bottom: "-50px",
            position: "fixed",
          }}
        >
          <LineChart
            data={highestRewards.map(
              (reward: HighestRewardMonthly, i: number) => ({
                ...reward,
                x: i,
              })
            )}
            lineLabel="transactions"
            accessors={{
              xAccessor: (d: HighestRewardMonthly & { x: number }) => d.x,
              yAccessor: (d: HighestRewardMonthly) =>
                d.winning_amount_scaled * 1000000 + 1,
            }}
            renderTooltip={({ datum }: { datum: HighestRewardMonthly }) => (
              <Tooltip
                style={{
                  minWidth: 160,
                  gap: "0.4em",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text>{format(parseISO(datum.awarded_day), "dd/MM/yy")}</Text>
                <div>
                  <Text prominent>
                    {datum.winning_address === MintAddress
                      ? "Mint Address"
                      : trimAddress(datum.winning_address)}
                  </Text>
                </div>
                <div>
                  <Text prominent>
                    {numberToMonetaryString(datum.winning_amount_scaled)}{" "}
                  </Text>
                  <Text>prize awarded</Text>
                </div>
              </Tooltip>
            )}
          />
        </div>

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
          <Modal id="switch-chain-dashboard" visible={showChainDashboardModal}>
            <BlockchainModal
              handleModal={setShowChainDashboardModal}
              option={{ name: "", icon: <div /> }}
              options={enabledChains}
              setOption={(chain: string) =>
                navigate(`/${networkMapper(chain)}/dashboard/home`)
              }
              mobile={width <= mobileBreakpoint}
            />
          </Modal>
        </div>

        <div className="disconnected">
          <div className="opportunity">
            <div className="opportunity-bottom">
              <div className="opportunity-text">
                {/* Highest Winner */}
                {highestWinner.address && (
                  <Display className="opportunity-text-top" size={"xs"}>
                    <Text>
                      <a
                        href={getAddressExplorerLink(
                          highestWinner.network as Chain,
                          highestWinner.address
                        )}
                      >
                        <Text prominent>
                          {appendLeading0x(
                            trimAddressShort(
                              normaliseAddress(highestWinner.address)
                            )
                          )}
                        </Text>
                      </a>
                      {" claimed "}
                      <Text prominent>
                        {numberToMonetaryString(highestWinner.totalWinnings)}
                      </Text>
                      {` in fluid prizes over ${
                        highestWinner.transactionCount
                      } transaction${
                        highestWinner.transactionCount > 1 ? "s" : ""
                      }.`}
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
                type="primary"
                handleClick={() => {
                  setShowChainOpportunityModal(true);
                }}
              >
                MAKE IT RAIN
              </GeneralButton>
            </div>
          </div>

          {/* Switch Chain Modal - Opportunity */}
          <Modal
            id="switch-chain-opportunity"
            visible={showChainOpportunityModal}
          >
            <BlockchainModal
              handleModal={setShowChainOpportunityModal}
              option={{ name: "", icon: <div /> }}
              options={enabledChains}
              setOption={(chain: string) =>
                navigate(`/${networkMapper(chain)}`)
              }
              mobile={width <= mobileBreakpoint}
            />
          </Modal>
        </div>
      </div>
    </>
  );
}

export { ErrorBoundary };
