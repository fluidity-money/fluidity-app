// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HowItWorksTemplate from "../../components/HowItWorksTemplate";
import { ReusableGrid } from "@fluidity-money/surfing";
import Video from "components/Video";
import styles from "./FluidWars.module.scss";
import useViewport from "hooks/useViewport";

const FluidWars = () => {
  /* scrolls to location on pageload if it contains same ID or scrolls to the top
   for ResourcesNavModal to work*/
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      let elem = document.getElementById(location.hash.slice(1));
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [location]);

  const { width } = useViewport();
  const breakpoint = 860;

  const left =
    width > breakpoint ? (
      <Video
        src={window.location.origin + '/assets/videos/FluidityFluidWars.mp4'}
        type={"fit"}
        loop={true}
        scale={2.0}
        margin={"0 0 0 270px"}
      />
    ) : (
      <Video
        src={window.location.origin + '/assets/videos/FluidityFluidWars.mp4'}
        type={"fit"}
        loop={true}
      />
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
