import React from "react";
import styles from "./RewardsInfoBox.module.scss";
import { ToggleButton } from "../Button";

interface IRewardBoxProps {
  handleClick: () => void;
}

const RewardsInfoBox = ({ handleClick }: IRewardBoxProps) => {
  return (
    <div className={styles.infoBox}>
      <h1 onClick={handleClick}>$678,123.00</h1>
      <h3 onClick={handleClick}>Reward pool</h3>
      <ToggleButton />
    </div>
  );
};

export default RewardsInfoBox;
