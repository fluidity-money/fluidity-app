// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HowItWorksTemplate from "components/HowItWorksTemplate";
import { ReusableGrid } from "@fluidity-money/surfing";
import useViewport from "hooks/useViewport";
import styles from "./Wrap.module.scss";
import Video from "components/Video";

const Wrap = () => {
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
    width < breakpoint ? (
      <Video src={window.location.origin + '/assets/videos/FluidityWrap.mp4'} type={'fit'} loop={true}/>
    ) : (
      <HowItWorksTemplate header={header} info={info}>
        Wrapped tokens
      </HowItWorksTemplate>
    );

  const right =
    width > breakpoint ? (
      <Video src={window.location.origin + '/assets/videos/FluidityWrap.mp4'} type={'fit'} loop={true}/>
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
