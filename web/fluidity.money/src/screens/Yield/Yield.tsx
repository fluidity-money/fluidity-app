// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { ReusableGrid, useViewport } from "@fluidity-money/surfing";
import HowItWorksTemplate from "../../components/HowItWorksTemplate";
import styles from "./Yield.module.scss";
import Video from "components/Video";

const Yield = () => {

  // to set order correct when in column layout
  const { width } = useViewport();
  const breakpoint = 860;
  
  const left =
  width <= breakpoint ? (
    <>
      <Video
        src={"/assets/videos/FluidityYield.mp4"}
        type={"fit"}
        loop={true}
      />
    </>
  ) : (
    <HowItWorksTemplate header={header} info={info}>
      Yield through utility
    </HowItWorksTemplate>
  );

  const right =
  width > breakpoint ? (
    <>
      <Video
        src={"/assets/videos/FluidityYield.mp4"}
        type={"fit"}
        loop={true}
      />
    </>
  ) : (
    <HowItWorksTemplate header={header} info={info}>
      Yield through utility
    </HowItWorksTemplate>
  );

  return (
    <div className={styles.container} id="yield&win">
      <ReusableGrid left={left} right={right} />
    </div>
  );
};

export default Yield;

const header = "Yield is gained through utility.";

const info = [
  "A novel property of fluid Assets is that they expose users to randomly paid rewards or yield when they are used, sent or received.",
  "All forms of value transfer can now be incentivized. ",
  "We are creating a general all-purpose incentive mechanism that basically anyone can utilize in any on-chain use case that can incentivize actions. It is a system that is able to be embedded into different systems, platforms and protocols very easily.",
];
