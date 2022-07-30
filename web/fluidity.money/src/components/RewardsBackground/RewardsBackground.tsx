import React from "react";
import RewardsCarousel from "../RewardsCarousel";
import styles from "./RewardsBackground.module.scss";

const RewardsBackground = () => {
  return (
    <div className={styles.container}>
      <div className={styles.shade}></div>
      <div className={styles.rewardsBackground}>
        <RewardsCarousel direction="right" />
        <RewardsCarousel direction="left" />
        <RewardsCarousel direction="right" />
        <RewardsCarousel direction="left" />
        <RewardsCarousel direction="right" />
        <RewardsCarousel direction="left" />
        <RewardsCarousel direction="right" />
        <RewardsCarousel direction="left" />
        <RewardsCarousel direction="right" />
        <RewardsCarousel direction="left" />
        <RewardsCarousel direction="right" />
        <RewardsCarousel direction="left" />
        <RewardsCarousel direction="right" />
        <RewardsCarousel direction="left" />
        <RewardsCarousel direction="right" />
      </div>
    </div>
  );
};

export default RewardsBackground;
