import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReusableGrid from "components/ReusableGrid";
import HowItWorksTemplate from "../../components/HowItWorksTemplate";
import styles from "./Use.module.scss";
// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

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
            Fluid asset use-cases
          </HowItWorksTemplate>
        }
      />
    </div>
  );
};

export default Use;

const header = " Fluid assets apportion yield when utilized on-chain.  ";

const info = [
  "Fluidity is realigning incentives by rewarding utility and usage. Fluid assets are composable by nature and can successfully promote both user and platform engagement through its novel reward distribution mechanisms. The fluid ecosystem also allows developers to compose how and when these rewards are distributed.  ",
  "Use cases include marketplaces, decentralized exchanges, and any use-case where tokens are transacted on chain.",
];
