import {
  Display,
  GeneralButton,
  LineChart,
  LinkButton,
  Text,
} from "@fluidity-money/surfing";
import { json, LinksFunction, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { useToolTip, ToolTipContent } from "~/components";
import Video from "~/components/Video";
import useViewport from "~/hooks/useViewport";
import useHighestRewardStatistics, {
  HighestRewardResponse,
} from "~/queries/useHighestRewardStatistics";
import opportunityStyles from "~/styles/opportunity.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: opportunityStyles }];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const network = params.network ?? "";
  const { data, error } = await useHighestRewardStatistics("ethereum");

  if (error || !data) {
    return redirect("/error", { status: 500, statusText: error });
  }

  const winnerTotals = data.highest_reward_winner_totals.reduce(
    (prev, current) => ({
      ...prev,
      [current.winning_address]: {
        transactionCount: current.transaction_count,
        totalWinnings: current.total_winnings,
      },
    }),
    {}
  );

  const highestRewards = data.highest_rewards_monthly;

  return json({
    highestRewards,
    winnerTotals,
  });
};

type LoaderData = {
  winnerTotals: {
    [Address: string]: {
      transactionCount: number;
      totalWinnings: number;
    };
  };
  highestRewards: HighestRewardResponse["data"]["highest_rewards_monthly"];
};

export default function IndexPage() {
  // on hover, use winnerTotals[hovered address]
  const toolTip = useToolTip();
  const [connected, setConnected] = useState(true);
  const { highestRewards, winnerTotals } = useLoaderData<LoaderData>();
  const { width } = useViewport();
  console.log(width);
  const showNotification = () => {
    toolTip.open(
      `#0000ff`,
      <ToolTipContent
        tokenLogoSrc={"images/tokenIcons/usdcFluid.svg"}
        boldTitle={"200 fUSDC"}
        details={"Received from 0x0000"}
        linkLabel={"ASSETS"}
        linkUrl={"#"}
      />
    );
  };

  return (
    <>
      <Video
        className="video"
        src={
          !connected
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
        {!connected ? (
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
                  handleClick={() => {
                    return;
                  }}
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
                  <Display className="opportunity-text-top" size={"xs"}>
                    <Text>
                      <Text prominent>{"{address}"}</Text>
                      {" claimed "}
                      <Text prominent>{"${amount}"}</Text>
                      {" in fluid prizes over {transactionCount} transactions."}
                    </Text>
                  </Display>

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
                    return;
                  }}
                >
                  MAKE IT RAIN
                </GeneralButton>
              </div>
            </div>
            <div className="opportunity-graph">
              <button
                style={{
                  backgroundColor: "blue",
                  marginLeft: "10px",
                  padding: "20px",
                }}
                onClick={showNotification}
              >
                <Text prominent size="xxl">
                  Pop Notification Demo | Test Button
                </Text>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
