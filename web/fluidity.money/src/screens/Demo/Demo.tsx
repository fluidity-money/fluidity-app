// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { useChainContext } from "hooks/ChainContext";
import useViewport from "hooks/useViewport";
import {
  Display,
  Text,
  numberToMonetaryString,
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

  /*
  full screen demo
  */
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
            {/* <GeneralButton version={"primary"} buttontype={"text"} size={"medium"} handleClick={function (): void {       
            } }>
              SHOW ME A DEMO
            </GeneralButton> */}
            <Video
              className={styles.comingSoonButton}
              src={"/assets/videos/FluidityComingSoon.mp4"}
              type={"reduce"}
              loop={true}
              scale={0.4}
              width={"auto"}
              height={80}
            />
          </section>
        </div>
      </div>
    </>
  );
};

export default Demo;
