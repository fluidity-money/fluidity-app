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
