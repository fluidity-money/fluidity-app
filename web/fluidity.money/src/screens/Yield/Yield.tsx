// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ReusableGrid } from "@fluidity-money/surfing";
import useViewport from "hooks/useViewport";
import HowItWorksTemplate from "../../components/HowItWorksTemplate";
import styles from "./Yield.module.scss";
import Video from "components/Video";

const Yield = () => {
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

  // to set order correct when in column layout
  const { width } = useViewport();
  const breakpoint = 860;

  const left =
    width <= breakpoint ? (
      <Video
        src={window.location.origin + "/assets/videos/FluidityYield.mp4"}
        type={"fit"}
        loop={true}
        scale={1.4}
      />
    ) : (
      <HowItWorksTemplate header={header} info={info}>
        Yield through utility
      </HowItWorksTemplate>
    );

  const right =
    width > breakpoint ? (
      <Video
        src={window.location.origin + "/assets/videos/FluidityYield.mp4"}
        type={"fit"}
        loop={true}
        scale={1.8}
      />
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
