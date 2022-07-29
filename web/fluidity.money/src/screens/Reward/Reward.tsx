import React from "react";
import RewardsCarousel from "../../components/RewardsCarousel";
import styles from "./Reward.module.scss";

const Reward = () => {
  /* Background of transaction info moving left and right cotinuously,
  Reward pool total with sol and eth toggle,
  click on prize total slide prize total to the top right,
  graph background,
  total transactions sol and eth,
  */
  return (
    <div className={styles.container}>
      {/* <div>Reward</div> */}
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
