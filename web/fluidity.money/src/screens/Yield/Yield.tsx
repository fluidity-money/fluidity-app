import ReusableGrid from "components/ReusableGrid";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HowItWorksTemplate from "../../components/HowItWorksTemplate";
import styles from "./Yield.module.scss";
// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

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
  return (
    <div className={styles.container} id="yield&win">
      <ReusableGrid
        left={
          <HowItWorksTemplate header={header} info={info}>
            {"Yield & win"}
          </HowItWorksTemplate>
        }
        right={<div style={{ fontSize: 160 }}>🦍</div>}
      />
    </div>
  );
};

export default Yield;

const header = "Yield is gained through utility.";

const info = [
  "A novel property of Fluid Assets is that they expose users to randomly paid rewards or yield when they are used, sent or received.",
  "All forms of value transfer can now be incentivised. ",
  "We are creating a general all-purpose incentive mechanism that basically anyone can utilise in any on-chain use case that can incentivise actions. It is a system that is able to be embedded into different systems, platforms and protocols very easily.",
];
