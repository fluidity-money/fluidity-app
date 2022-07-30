import React from "react";
import styles from "./RewardsInfoBox.module.scss";
import { ToggleButton } from "../Button";

interface IRewardBoxProps {
  setToggle: () => void;
  toggle: boolean;
  initalView: boolean;
  switchAndAnimate: () => void;
  type: "black" | "transparent";
}

const RewardsInfoBox = ({
  setToggle,
  toggle,
  initalView,
  switchAndAnimate,
  type,
}: IRewardBoxProps) => {
  return (
    <div
      className={
        initalView
          ? `${styles.infoBoxContainer} ${
              type === "black" ? styles.fadeIn : styles.fadeOut
            }`
          : `${styles.infoBoxContainer} ${
              type === "black" ? styles.fadeOut : styles.fadeIn
            }`
      }
    >
      <div
        className={
          type === "black" ? styles.infoBox : styles.infoBoxTransparent
        }
      >
        <h1 onClick={switchAndAnimate}>
          {type === "black" ? "$678,123.00" : "$1,231,246"}
        </h1>
        <h3>{type === "black" ? "Reward pool" : "Total transactions"}</h3>
        <ToggleButton toggle={toggle} setToggle={setToggle} />
      </div>
    </div>
  );
};

export default RewardsInfoBox;
