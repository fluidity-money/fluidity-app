import { Display, Text } from "@fluidity-money/surfing";

import config from "../webapp.config";
import { io } from "socket.io-client";
import { PipedTransaction } from "drivers/types";

import { useToolTip } from "~/components";
import { ToolTipContent } from "~/components/ToolTip";

export default function IndexPage() {
  const toolTip = useToolTip();
  const showNotification = () => {
    // This just used to test ui
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
  }
    
    
  const socket = io();
  
  const connected_wallet = "Ez2zVjw85tZan1ycnJ5PywNNxR6Gm4jbXQtZKyQNu3Lv"
  
  socket.emit("subscribeTransactions", {
    protocol: `solana`,
    address: connected_wallet,
  });

  socket.on("Transactions", (log :PipedTransaction) => {

    let tokenProps = config.tokens;

    let bgColour :string;
    let tokenLogo :string;

    switch(log.token){
      case `fUSDC`: 
        bgColour = tokenProps.colours.fUSDC;
        tokenLogo = tokenProps.logos.fUSDC;
        break;
      case `fUSDT`: 
        bgColour = config.tokens.colours.fUSDT;
        tokenLogo = tokenProps.logos.fUSDC;
        break;
      case `fTUSD`: 
        bgColour = tokenProps.colours.fTUSD;
        tokenLogo = tokenProps.logos.fTUSD;
        break;
      case `fDAI`: 
        bgColour = tokenProps.colours.fDAI;
        tokenLogo = tokenProps.logos.fDAI;
        break;
      case `fFRAX`: 
        bgColour = tokenProps.colours.fFRAX;
        tokenLogo = tokenProps.logos.fFRAX;
        break;
      default:
        bgColour = `fffffff`
        tokenLogo = ``;
    }

    toolTip.open(
      bgColour
      ,
      <ToolTipContent
        tokenLogoSrc={tokenLogo}
        boldTitle={log.amount + ` ` + log.token}
        details={log.source === connected_wallet ? `Sent to ` + log.destination : `Received from ` + log.source}
        linkLabel={"ASSETS"}
        linkUrl={"#"}
      />
    )
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
