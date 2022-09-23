// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import HowItWorksTemplate from "../../components/HowItWorksTemplate";
import { ReusableGrid } from "@fluidity-money/surfing";
import Video from "components/Video";
import styles from "./FluidWars.module.scss";
import useViewport from "hooks/useViewport";

const FluidWars = () => {
  const { width } = useViewport();
  const breakpoint = 860;

  //for whatever happens that stops the video from playing like on ios due to powersaver turned on. - play a low res webp
  //also for an awful network - play a low res webp while main vid loads
  const [onHomeVidLoaded, setOnHomeVidLoaded] = useState(false);

  const left =
  width > breakpoint ? (
    <>
      <img
      src="/assets/images/Animations/FluidityWars.webp"
      style={{
        position: "relative",
        width: "200%",
        display: `${onHomeVidLoaded === true ? "none" : "block"}`,
      }}
      alt="Fluidity Wars" />
      <Video
        src={'/assets/videos/FluidityFluidWars.mp4'}
        type={"fit"}
        display= {!onHomeVidLoaded ? "none" : "inline"}
        loop={true}
        onLoad={!onHomeVidLoaded ? () => setOnHomeVidLoaded(true) : () => { } }
        scale={2.0}
        margin={"0 0 0 270px"}
      />
    </>

  ) : (
    <>
      <img
        src="/assets/images/Animations/FluidityWars.webp"
        style={{
          position: "relative",
          width: "100%",
          display: `${onHomeVidLoaded === true ? "none" : "block"}`,
        }}
        alt="Fluidity Wars" />

      <Video
        src={'/assets/videos/FluidityFluidWars.mp4'}
        type={"fit"}
        display= {!onHomeVidLoaded ? "none" : "inline"}
        loop={true}
        onLoad={!onHomeVidLoaded ? () => setOnHomeVidLoaded(true) : () => { } }
      />     
    </>
  );

  const right = 
  <HowItWorksTemplate header={header} info={info}>
    Fluidity wars
  </HowItWorksTemplate>

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
