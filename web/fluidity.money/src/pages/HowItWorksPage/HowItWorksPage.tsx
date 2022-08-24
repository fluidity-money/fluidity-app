import React from "react";
import Demo from "../../screens/Demo";
import FluidWars from "../../screens/FluidWars";
import Footer from "../../screens/Footer";
import Incentivising from "../../screens/Incentivising";
import Roadmap from "../../screens/Roadmap";
import Use from "../../screens/Use";
import Wrap from "../../screens/Wrap";
import Yield from "../../screens/Yield";
import styles from "./HowItWorksPage.module.scss";

const HowItWorksPage = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.screensContainer}>
        <Incentivising />
        <Wrap />
        <Use />
        <Yield />
        <FluidWars />
        <Roadmap />
        <Demo />
        <Footer />
      </div>
    </div>
  );
};

export default HowItWorksPage;
