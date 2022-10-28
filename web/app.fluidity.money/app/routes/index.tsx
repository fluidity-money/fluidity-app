import type { LinksFunction } from "@remix-run/node";

import { Display, LineChart, Text } from "@fluidity-money/surfing";
import {json, LoaderFunction, redirect} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import { useToolTip } from "~/components";
import useHighestRewardStatistics, {HighestRewardResponse} from "~/queries/useHighestRewardStatistics";

export const loader: LoaderFunction = async({request, params}) => {
  const network = params.network ?? "";
  const {data, error} = await useHighestRewardStatistics(network);

  if (error || !data) {
    return redirect("/error", { status: 500, statusText: error });
  }

  const winnerTotals = data.highest_reward_winner_totals.reduce((prev, current) => (
    {
      ...prev, 
      [current.winning_address]: {
        transactionCount: current.transaction_count, 
        totalWinnings: current.total_winnings
        }
    }), {})

  const highestRewards = data.highest_rewards_monthly;

  return json({
    highestRewards,
    winnerTotals 
  });
}

type LoaderData = {
  winnerTotals: {[Address: string]: {
    transactionCount: number, 
    totalWinnings: number
  }}
  highestRewards: HighestRewardResponse["data"]["highest_rewards_monthly"]
}

import opportunityStyles from "~/styles/opportunity.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: opportunityStyles }];
};

export default function IndexPage() {
  // on hover, use winnerTotals[hovered address]
  const {highestRewards, winnerTotals} = useLoaderData<LoaderData>();
  const toolTip = useToolTip();

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
    <div>
      <Display size="lg" className="no-margin">
        <Text>
          <Text prominent>{"{address}"}</Text>
          {" claimed "}
          <Text prominent>{"${amount}"}</Text>
          {" in fluid prizes over {transactionCount} transactions."}
        </Text>
      </Display>

      <Text size="xxl">Connect your wallet to see what you could make.</Text>
      <button>Make it rain</button>

      <button
        style={{ backgroundColor: "blue", marginLeft: "10px", padding: "20px" }}
        onClick={showNotification}
      >
        <Text prominent size="xxl">
          Pop Notification Demo | Test Button
        </Text>
      </button>
    </div>
  );
}
