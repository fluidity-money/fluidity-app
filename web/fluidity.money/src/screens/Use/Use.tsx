// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HowItWorksTemplate from "../../components/HowItWorksTemplate";
import { ReusableGrid } from "@fluidity-money/surfing";
import styles from "./Use.module.scss";
import Video from "components/Video";

const Use = () => {
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

  const right = (
    <HowItWorksTemplate header={header} info={info}>
      Fluid asset use-cases
    </HowItWorksTemplate>
  );

  const left = (
    <Video
      src={window.location.origin + "/assets/videos/FluidityUse.mp4"}
      type={"fit"}
      loop={true}
      scale={2.0}
    />
  );

  return (
    <div className={styles.container} id="useassets">
      <ReusableGrid left={left} right={right} />
    </div>
  );
};

export default Use;

const header = " Fluid assets apportion yield when utilized on-chain.  ";

const info = [
  "Fluidity is realigning incentives by rewarding utility and usage. Fluid assets are composable by nature and can successfully promote both user and platform engagement through its novel reward distribution mechanisms. The fluid ecosystem also allows developers to compose how and when these rewards are distributed.  ",
  "Use cases include marketplaces, decentralized exchanges, and any use-case where tokens are transacted on chain.",
];
