// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { LinkButton, numberToMonetaryString } from "surfing";
import styles from "./RewardsInfoBox.module.scss";

interface IRewardBoxProps {
  rewardPool: number,
  totalTransactionValue: number,
  setToggle: () => void;
  toggle: boolean;
  initalView: boolean;
  switchAndAnimate: () => void;
  type: "black" | "transparent";
}

const RewardsInfoBox = ({
  rewardPool,
  totalTransactionValue,
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
        <button>ETH v</button>
        <h1 onClick={switchAndAnimate}>
          {type === "black" ? numberToMonetaryString(rewardPool) : totalTransactionValue}
        </h1>
        <h3>{type === "black" ? "Reward pool" : "Total transactions"}</h3>
        <LinkButton size={"medium"} type={"internal"} handleClick={() => {}}>
          FLUID STATS
        </LinkButton>
      </div>
    </div>
  );
};

export default RewardsInfoBox;
