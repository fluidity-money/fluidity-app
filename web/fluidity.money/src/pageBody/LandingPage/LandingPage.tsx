// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import Head from "next/head";
import { IPropPools } from "pages";
import Articles from "screens/Articles";
import Demo from "../../screens/Demo";
import Footer from "../../screens/Footer";
import HowItWorks from "../../screens/HowItWorks";
import Landing from "../../screens/Landing";
import Reward from "../../screens/Reward";
import SponsorsPartners from "../../screens/SponsorsPartners";
import UseCases from "../../screens/UseCases";
import styles from "./LandingPage.module.scss";

const LandingPage = (props) => {
  const { ethPool, solPool } :IPropPools = JSON.parse(props.pools);

  return (
    <div className={styles.pageContainer}>
      <Head>
        <title>Fluidity - Supercharge your Crypto</title>
        <meta name="description" content="Fluidity lets you earn while spending your crypto. Get more out your crypto - Fluidify your money." />
      </Head>
      <div id={"modal"} className={styles.screensContainer}>
        <Landing />
        <Reward ethPool={Number(ethPool)} solPool={Number(solPool)} />
        <HowItWorks />
        <UseCases />
        <SponsorsPartners />
        {/* Ecosystem which scrolls to projects as a component, not ready for production yet */}
        {/* <Ecosystem /> */}
        <Articles isResourcesPage={false} />
        <Demo />
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
