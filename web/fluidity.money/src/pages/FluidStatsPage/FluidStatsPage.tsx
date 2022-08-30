// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import React from "react";
import Demo from "../../screens/Demo";
import Footer from "../../screens/Footer";
import LineChart from "../../screens/LineChart";
import RewardsInfo from "../../screens/RewardsInfo";
import Transactions from "../../screens/Transactions";
import styles from "./FluidStatsPage.module.scss";

const FluidStatsPage = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.screensContainer}>
        <LineChart />
        <RewardsInfo />
        <Transactions />
        <Demo />
        <Footer />
      </div>
    </div>
  );
};

export default FluidStatsPage;
