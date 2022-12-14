// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { useChainContext } from "hooks/ChainContext";
import useViewport from "hooks/useViewport";
import {
  Display,
  Text,
  numberToMonetaryString,
  GeneralButton,
} from "@fluidity-money/surfing";
import Video from "components/Video";
import styles from "./Demo.module.scss";

const Demo = () => {
  const { apiState } = useChainContext();
  const { weekWinnings } = apiState;

  const { width } = useViewport();
  const breakpoint = 620;

  const weekTotalRewards = weekWinnings.reduce(
    (weekSum, { winning_amount, token_decimals }) =>
      weekSum + winning_amount / 10 ** token_decimals,
    0
  );

  const handleConnectWallet = () => (window.location.href = "https://app.fluidity.money/wtf");
  const handleLaunchFluidity = () => (window.location.href = "https://app.fluidity.money/");

  return (
    <>
      <div className={`${styles.container} bg-light`}>
        <Video
          src={
            "/assets/videos/FluidityOpportunityB.mp4"
          }
          type={"none"}
          loop={true}
        />

        <div id="demo">
          <Display
            size={width > breakpoint ? "lg" : "sm"}
          >
            {numberToMonetaryString(weekTotalRewards)}
          </Display>
          <Display
            size={width > breakpoint ? "xs" : "xxs"}
            color={"gray"}
          >
            Fluid prizes claimed in the last week.
          </Display>
          <Text
            size={width > breakpoint ? "xl" : "lg"}
          >
            Connect your wallet to see what you could make.
          </Text>
          <section>
            <GeneralButton 
              version={"primary"} 
              buttontype={"text"} 
              size={"large"} 
              handleClick={handleConnectWallet}
            >
              Connect Wallet
            </GeneralButton>
            <GeneralButton 
              version={"secondary"} 
              buttontype={"text"} 
              size={width > breakpoint ? "large" : "small"} 
              handleClick={handleLaunchFluidity}
            >
              Launch Fluidity
            </GeneralButton>
          </section>
        </div>
      </div>
    </>
  );
};

export default Demo;
