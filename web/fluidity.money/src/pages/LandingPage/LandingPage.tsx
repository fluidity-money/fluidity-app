import React from "react";
import Demo from "../../screens/Demo";
import Footer from "../../screens/Footer";
import HowItWorks from "../../screens/HowItWorks";
import Landing from "../../screens/Landing";
import Projects from "../../screens/Projects";
import Resources from "../../screens/Resources";
import Reward from "../../screens/Reward";
import SponsorsPartners from "../../screens/SponsorsPartners";
import UseCases from "../../screens/UseCases";
import styles from "./LandingPage.module.scss";

const LandingPage = () => {
  return (
    <div className={styles.pageContainer}>
      <Landing />
      <Reward />
      {/* 
      <HowItWorks />
      <UseCases />
      <SponsorsPartners />
      <Projects />
      <Resources />
      <Demo />
      <Footer /> */}
    </div>
  );
};

export default LandingPage;
