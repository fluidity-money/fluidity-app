// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import HowItWorksTemplate from "../../components/HowItWorksTemplate";
import { ReusableGrid, useViewport, Video } from "@fluidity-money/surfing";
import styles from "./FluidWars.module.scss";

const FluidWars = () => {
  const { width } = useViewport();
  const breakpoint = 860;

  const left =
    width > breakpoint ? (
      <>
        <Video
          src={"/assets/videos/FluidityFluidWars.mp4"}
          type={"fit"}
          loop={true}
          scale={2.0}
          margin={"0 0 0 270px"}
        />
      </>
    ) : (
      <>
        <Video
          src={"/assets/videos/FluidityFluidWars.mp4"}
          type={"fit"}
          loop={true}
        />
      </>
    );

  const right = (
    <HowItWorksTemplate header={header} info={info}>
      Fluidity wars
    </HowItWorksTemplate>
  );

  return (
    <div className={styles.container} id="fluiditywars">
      <ReusableGrid left={left} right={right} />
    </div>
  );
};

export default FluidWars;

const header = "User activity is incentivised through governance.";

const info = [
  "Fluidity will act as an incentive layer that operates at the blockchain level, orchestrating the primary user sentiments that drive the secondary liquidity effects. ",
  "Through Utility Mining, Fluidity and other protocols can drive in users whose primary yield incentives are to explore the protocol and exhibit intended behaviours that are beneficial for all parties involved.",
  "Enter Fluidity Wars—a perpetual war to control the flow of users in a world where genuine user engagement is apex currency.",
];
