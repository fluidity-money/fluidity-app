// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useState } from "react";
import HowItWorksTemplate from "components/HowItWorksTemplate";
import { ReusableGrid } from "@fluidity-money/surfing";
import useViewport from "hooks/useViewport";
import styles from "./Wrap.module.scss";
import Video from "components/Video";

const Wrap = () => {
  // to set order correct when in column layout
  const { width } = useViewport();
  const breakpoint = 860;

  //for whatever happens that stops the video from playing like on ios due to powersaver turned on. - play a low res webp
  //also for an awful network - play a low res webp while main vid loads
  const [onHomeVidLoaded, setOnHomeVidLoaded] = useState(false);
  
  const left =
  width <= breakpoint ? (
    <>
      <img
      src="/assets/images/Animations/FluidityWrap.webp"
      style={{
        position: "relative",
        width: "100%",
        display: `${onHomeVidLoaded === true ? "none" : "block"}`,
      }}
      alt="Fluidity Wrap" />
      <Video
        src={"/assets/videos/FluidityWrap.mp4"}
        type={"fit"}
        display= {!onHomeVidLoaded ? "none" : "inline"}
        loop={true}
        onLoad={!onHomeVidLoaded ? () => setOnHomeVidLoaded(true) : () => { } }
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
      <img
      src="/assets/images/Animations/FluidityWrap.webp"
      style={{
        position: "relative",
        width: "100%",
        display: `${onHomeVidLoaded === true ? "none" : "block"}`,
      }}
      alt="Fluidity Wrap" />
      <Video
        src={"/assets/videos/FluidityWrap.mp4"}
        type={"fit"}
        loop={true}
        display= {!onHomeVidLoaded ? "none" : "inline"}
        onLoad={!onHomeVidLoaded ? () => setOnHomeVidLoaded(true) : () => { } }
      />
    </>
  ) : (
    <HowItWorksTemplate header={header} info={info}>
      Wrapped tokens
    </HowItWorksTemplate>
  );

  return (
    <div className={styles.container} id="yield&win">
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
