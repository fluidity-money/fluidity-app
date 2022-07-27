import React from "react";
import Landing from "../../screens/Landing";
import Reward from "../../screens/Reward";
import styles from "./LandingPage.module.scss";

const LandingPage = () => {
  return (
    <div className={styles.pageContainer}>
      <Landing />
      <Reward />
    </div>
  );
};

export default LandingPage;
