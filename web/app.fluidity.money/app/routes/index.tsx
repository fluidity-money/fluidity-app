import { Display, LineChart, Text } from "@fluidity-money/surfing";
import {json, LoaderFunction, redirect} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import { useToolTip, ToolTipContent } from "~/components";
import useHighestRewardStatistics, {HighestRewardResponse} from "~/queries/useHighestRewardStatistics";

export default function IndexPage() {
  // on hover, use winnerTotals[hovered address]
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
      <Display size={"lg"}>
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
