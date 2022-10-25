import { Display, Text } from "@fluidity-money/surfing";
import { useLoaderData } from "@remix-run/react";

import config from "~/webapp.config.server";
import { io } from "socket.io-client";
import { PipedTransaction } from "drivers/types";

import { useToolTip } from "~/components";
import { ToolTipContent } from "~/components/ToolTip";
import { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request, params }) => {
  const url = new URL(request.url);

  const routeMapper = (route: string) => {
    switch (route.toLowerCase()) {
      case "home":
        return "DASHBOARD";
      case "rewards":
        return "REWARDS";
      case "assets":
        return "ASSETS";
      case "dao":
        return "DAO";
      default:
        return "DASHBOARD";
    }
  };

  const urlPaths = url.pathname.split("/");

  const pathname = urlPaths[urlPaths.length - 1];

  const network = params.network ?? "";

  const token = config.config;

  return {
    appName: routeMapper(pathname),
    version: "1.5",
    network,
    token,
  };
};

type LoaderData = {
  token: typeof config.config;
  network: string;
};

export default function IndexPage() {
  const toolTip = useToolTip();

  const { token, network } = useLoaderData<LoaderData>();
  const showNotification = () => {
    // This is here for testing purposes
    const fToken = token[network === `` ? `ethereum` : network].tokens.filter(
      (entry) => entry.symbol === `fUSDC`
    );

    console.log(fToken);

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

  // -> Temporary placement : later refactor these block to route/$network
  const socket = io();
  // Test for now, wallet address should be gotten when a wallet is connected
  const connected_wallet = "AHxyQvWfG5adQAFgURHhWXp5QoD1rvyPhWTAaZVXjpJy";

  socket.emit("subscribeTransactions", {
    protocol: `solana`,
    address: connected_wallet,
  });

  socket.on("Transactions", (log: PipedTransaction) => {
    const fToken = token[network === `` ? `ethereum` : network].tokens.filter(
      (entry) => entry.symbol === log.token
    );

    toolTip.open(
      fToken.at(0)?.colour,
      <ToolTipContent
        tokenLogoSrc={fToken.at(0)?.logo}
        boldTitle={log.amount + ` ` + log.token}
        details={
          log.source === connected_wallet
            ? `Sent to ` + log.destination
            : `Received from ` + log.source
        }
        linkLabel={"ASSETS"}
        linkUrl={"#"}
      />
    );
  });

  return (
    <div>
      <Display>
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
