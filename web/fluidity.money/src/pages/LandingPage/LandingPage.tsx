// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import React from "react";
import Articles from "screens/Articles";
import Ecosystem from "screens/Ecosystem";
import Demo from "../../screens/Demo";
import Footer from "../../screens/Footer";
import HowItWorks from "../../screens/HowItWorks";
import Landing from "../../screens/Landing";
import Resources from "../../screens/Resources";
import Reward from "../../screens/Reward";
import SponsorsPartners from "../../screens/SponsorsPartners";
import UseCases from "../../screens/UseCases";
import styles from "./LandingPage.module.scss";

const LandingPage = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.screensContainer}>
        <Landing />
        <Reward />
        <HowItWorks />
        <UseCases />
        <SponsorsPartners />
        {/* Ecosystem which scrolls to projects as a component */}
        <Ecosystem />
        <Resources />
        {/* Remove articles but style resources the same, reuse? */}
        <Articles />
        <Demo />
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
