// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import HowItWorksTemplate from "components/HowItWorksTemplate";
import { ReusableGrid, useViewport } from "@fluidity-money/surfing";
import styles from "./Wrap.module.scss";
import Video from "components/Video";

const Wrap = () => {
  // to set order correct when in column layout
  const { width } = useViewport();
  const breakpoint = 860;

  const left =
  width <= breakpoint ? (
    <>
      <Video
        src={"/assets/videos/FluidityWrap.mp4"}
        type={"fit"}
        loop={true}
        scale={0.7}
      />
    </>
    ) : (

      <HowItWorksTemplate header={header} info={info}>
        Wrapped tokens
      </HowItWorksTemplate>
    );

  const right =
  width > breakpoint ? (
    <>
      <Video
        src={"/assets/videos/FluidityWrap.mp4"}
        type={"fit"}
        loop={true}
        scale={0.7}
      />
    </>
  ) : (
    <HowItWorksTemplate header={header} info={info}>
      Wrapped tokens
    </HowItWorksTemplate>
  );

  return (
    <div className={styles.container} id="wraptokens">
      <ReusableGrid left={left} right={right} />
    </div>
  );
};

export default Wrap;

const header =
  "Fluid Assets are a 1:1 wrapped asset with perpetual payout properties. ";

const info = [
  "A 'fluid' asset is a wrapped standard token that is pegged to the underlying principal.  ",
  "Users are free from market volatility risks, and can redeem the base asset at any point of time through our web application or the method call on the corresponding swap contract.",
];
