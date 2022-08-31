import React, { useState } from "react";
import RewardsBackground from "../../components/RewardsBackground";
import RewardsInfoBox from "../../components/RewardsInfoBox";
import styles from "./Reward.module.scss";

const Reward = () => {
  /* Background of transactions info moving left and right cotinuously,
  Reward pool total with sol and eth toggle,
  click on prize total and switch screens to total transactions sol and eth,
  elements fade in and out then are conditionally removed
  */

  const [initalView, setInitalView] = useState(true);
  const [present, setPresent] = useState(true);
  const [toggle, setToggle] = useState(true);

  // animates then switches backgrounds
  const switchAndAnimate = () => {
    setInitalView(!initalView);
    setTimeout(() => {
      setPresent(!present);
    }, 1000);
  };

  // information on top of second screen
  const infoStats = (
    <div className={styles.info}>
      <div className={styles.infoSingle}>
        {/* hard coded on launch */}
        <h1>1400+</h1>
        <h4>Unique wallets</h4>
      </div>
      <div className={styles.infoSingle}>
        {/* hard coded on launch */}
        <h1>32,689</h1>
        <h4>Fluid asset pairs</h4>
      </div>
      <div className={styles.infoSingle}>
        <h1>678,123.00</h1>
        <h4>Reward Pool</h4>
      </div>
    </div>
  );

  return (
    <>
      <div className={styles.container}>
        <div
          className={
            initalView
              ? `${styles.stats} ${styles.fadeOut}`
              : `${styles.stats} ${styles.fadeIn}`
          }
        >
          {infoStats}
        </div>

        <RewardsInfoBox
          toggle={toggle}
          setToggle={() => setToggle(!toggle)}
          initalView={initalView}
          switchAndAnimate={switchAndAnimate}
          type="black"
        />

        <RewardsInfoBox
          toggle={toggle}
          setToggle={() => setToggle(!toggle)}
          initalView={initalView}
          switchAndAnimate={switchAndAnimate}
          type="transparent"
        />

        {present && (
          <div
            className={
              initalView
                ? `${styles.rewardsBackground} ${styles.fadeIn}`
                : `${styles.rewardsBackground} ${styles.fadeOut} `
            }
          >
            <RewardsBackground />
          </div>
        )}
      </div>
    </>
  );
};

export default Reward;

export const rewards = [
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
