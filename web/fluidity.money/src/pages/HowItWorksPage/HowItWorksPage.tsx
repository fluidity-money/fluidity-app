// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import Demo from "../../screens/Demo";
import FluidWars from "../../screens/FluidWars";
import Footer from "../../screens/Footer";
import Incentivising from "../../screens/Incentivising";
import Roadmap from "../../screens/Roadmap";
import Use from "../../screens/Use";
import Wrap from "../../screens/Wrap";
import Yield from "../../screens/Yield";
import { Navigation } from "@fluidity-money/surfing";
import styles from "./HowItWorksPage.module.scss";

const HowItWorksPage = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.screensContainer}>
        <Navigation
          page={"howitworks"}
          pageLocations={pageLocations}
          background={"clear"}
        />
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

const pageLocations = [
  "wrap tokens",
  "use assets",
  "yield & win",
  "fluidity wars",
];
