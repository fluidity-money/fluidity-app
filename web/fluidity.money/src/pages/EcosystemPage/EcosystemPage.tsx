// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import Demo from "../../screens/Demo";
import FeaturedProjects from "../../screens/FeaturedProjects";
import Filter from "../../screens/AllProjects";
import FluidProjects from "../../screens/FluidProjects";
import Footer from "../../screens/Footer";
import Search from "../../screens/Search";
import AllProjects from "../../screens/AllProjects";
import { Navigation } from "@fluidity-money/surfing";
import styles from "./EcosystemPage.module.scss";

const FluidEcosystemPage = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.screensContainer}>
        <Navigation
          page={"ecosystem"}
          pageLocations={["featured projects", "all projects"]}
          background={"clear"}
        />
        <Search />
        <FeaturedProjects />
        <AllProjects />
        <Demo />
        <Footer />
      </div>
    </div>
  );
};

export default FluidEcosystemPage;
