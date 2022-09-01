// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import React from "react";
import Demo from "../../screens/Demo";
import FeaturedProjects from "../../screens/FeaturedProjects";
import Filter from "../../screens/AllProjects";
import FluidProjects from "../../screens/FluidProjects";
import Footer from "../../screens/Footer";
import Search from "../../screens/Search";
import styles from "./EcosystemPage.module.scss";
import AllProjects from "../../screens/AllProjects";
import Navigation from "components/Navigation";

const FluidEcosystemPage = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.screensContainer}>
        <Navigation
          page={"ecosystem"}
          pageLocations={["featured projects", "all projects"]}
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
