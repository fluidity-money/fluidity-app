import React, { useState } from "react";
import { ToggleButton } from "../../components/Button";
import RewardsCarousel from "../../components/RewardsCarousel";
import RewardsInfoBox from "../../components/RewardsInfoBox";
import styles from "./Reward.module.scss";

const Reward = () => {
  /* Background of transaction info moving left and right cotinuously,
  Reward pool total with sol and eth toggle,
  click on prize total slide prize total to the top right,
  graph background,
  total transactions sol and eth,
  */
  const [initalView, setInitalView] = useState(true);
  return (
    <>
      <div className={styles.container}>
        {/* info */}
        <div
          className={
            initalView
              ? `${styles.stats} ${styles.fadeOut}`
              : `${styles.stats} ${styles.fadeIn}`
          }
        >
          <div className={styles.info}>
            <h4>1400+</h4>
            <h4>Unique wallets</h4>
          </div>
          <div className={styles.info}>
            <h4>32,689</h4>
            <h4>Fluid asset pairs</h4>
          </div>
          <div className={styles.info}>
            <h4>678,123.00</h4>
            <h4>Reward Pool</h4>
          </div>
        </div>
        {/* boxes */}
        <div
          className={
            initalView
              ? `${styles.infoBox} ${styles.fadeIn}`
              : `${styles.infoBox} ${styles.fadeOut}`
          }
        >
          <h1 onClick={() => setInitalView(!initalView)}>{"$678,123.00"}</h1>
          <h3 onClick={() => setInitalView(!initalView)}>{"Reward pool"}</h3>
          <ToggleButton />
        </div>

        <div
          className={
            initalView
              ? `${styles.infoBoxTransparent} ${styles.fadeOut}`
              : `${styles.infoBoxTransparent} ${styles.fadeIn}`
          }
        >
          <h1 onClick={() => setInitalView(!initalView)}>{"$1,231,246"}</h1>
          <h3 onClick={() => setInitalView(!initalView)}>
            {"Total transactions"}
          </h3>
          <ToggleButton />
        </div>

        <div
          className={
            initalView
              ? `${styles.rewardsBackground} ${styles.fadeIn}`
              : `${styles.rewardsBackground} ${styles.fadeOut}`
          }
        >
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
    </>
  );
};

export default Reward;

const rewards = [
  {
    blockchain: "🦍",
    amount: "1.01",
    id: "9ozY5b..saDwFf",
    date: "21.06.22 11:54am",
  },
  {
    blockchain: "🦍",
    amount: "1.01",
    id: "9ozY5b..saDwFf",
    date: "21.06.22 11:54am",
  },
  {
    blockchain: "🦍",
    amount: "1.01",
    id: "9ozY5b..saDwFf",
    date: "21.06.22 11:54am",
  },
  {
    blockchain: "🦍",
    amount: "1.01",
    id: "9ozY5b..saDwFf",
    date: "21.06.22 11:54am",
  },
  {
    blockchain: "🦍",
    amount: "1.01",
    id: "9ozY5b..saDwFf",
    date: "21.06.22 11:54am",
  },
  {
    blockchain: "🦍",
    amount: "1.01",
    id: "9ozY5b..saDwFf",
    date: "21.06.22 11:54am",
  },
  {
    blockchain: "🦍",
    amount: "1.01",
    id: "9ozY5b..saDwFf",
    date: "21.06.22 11:54am",
  },
  {
    blockchain: "🦍",
    amount: "1.01",
    id: "9ozY5b..saDwFf",
    date: "21.06.22 11:54am",
  },
  {
    blockchain: "🦍",
    amount: "1.01",
    id: "9ozY5b..saDwFf",
    date: "21.06.22 11:54am",
  },
  {
    blockchain: "🦍",
    amount: "1.01",
    id: "9ozY5b..saDwFf",
    date: "21.06.22 11:54am",
  },
];
