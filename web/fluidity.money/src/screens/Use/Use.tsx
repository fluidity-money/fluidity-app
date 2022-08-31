// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HowItWorksTemplate from "../../components/HowItWorksTemplate";
import { ReusableGrid } from "surfing";
import styles from "./Use.module.scss";

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
  return (
    <div className={styles.container} id="useassets">
      <ReusableGrid
        left={<div style={{ fontSize: 160 }}>🦍</div>}
        right={
          <HowItWorksTemplate header={header} info={info}>
            Use assets
          </HowItWorksTemplate>
        }
      />
    </div>
  );
};

export default Use;

const header =
  "Fluid Assets distribute yield when used on any on-chain use-case. ";

const info = [
  "Fluidity is realigning incentives by by rewarding utility and usage. Fluid assets are composable in nature and as a result, are able to promote both user and platform engagement through their reward distribution mechanisms, as well as allow for developers to customise and compose how and when these rewards are distributed. ",
  "Use cases include marketplaces, decentralised exchanges, and any use-case where tokens are being transacted on chain.",
];
