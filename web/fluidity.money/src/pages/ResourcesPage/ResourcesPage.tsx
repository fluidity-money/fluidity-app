import React from "react";
import Navigation from "../../components/Navigation";
import Articles from "../../screens/Articles";
import Contact from "../../screens/Contact";
import Demo from "../../screens/Demo";
import Docs from "../../screens/Docs";
import Fluniversity from "../../screens/Fluniversity";
import Footer from "../../screens/Footer";
import Hero from "../../screens/Hero";
import Introducing from "../../screens/Introducing";
import Tweets from "../../screens/Tweets";
import Whitepapers from "../../screens/Whitepapers";
import styles from "./ResourcesPage.module.scss";

const ResourcesPage = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.screensContainer}>
        <Navigation page={"resources"} pageLocations={pageLocations} />
        <Hero />
        <Articles />
        <Tweets />
        <Introducing />
        <Fluniversity />
        <Contact />
        <Whitepapers />
        <Docs />
        <Demo />
        <Footer />
      </div>
    </div>
  );
};

export default ResourcesPage;

const pageLocations = [
  "articles",
  "fluniversity",
  "whitepapers",
  "documentation",
];
