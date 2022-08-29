import ReusableGrid from "components/ReusableGrid";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HowItWorksTemplate from "../../components/HowItWorksTemplate";
import styles from "./FluidWars.module.scss";

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
  return (
    <div className={styles.container} id="fluiditywars">
      <ReusableGrid
        left={<div style={{ fontSize: 160 }}>🦍</div>}
        right={
          <HowItWorksTemplate header={header} info={info}>
            Fluid wars
          </HowItWorksTemplate>
        }
      />
    </div>
  );
};

export default FluidWars;

const header = "User activity is incentivised through governance.";

const info = [
  "Fluidity and other protocols’ governance tokens can influence emissions, yield and incentives. Protocols can complement yield through their governance token.",
  "Fluidity’s Utility Mining creates incentive for users to participate, and aligns with genuine participation within the protocols. ",
  "User attention is an active engagement that protocols and users can participate in. ",
  "Enter Fluidity Wars - a perpetual war to control the flow of users.",
];
