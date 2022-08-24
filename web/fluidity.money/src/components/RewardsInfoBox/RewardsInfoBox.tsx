// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { LinkButton } from "components/Button";
import React from "react";
import styles from "./RewardsInfoBox.module.scss";

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
        <button>ETH v</button>
        <h1 onClick={switchAndAnimate}>
          {type === "black" ? "$678,123.00" : "$1,231,246"}
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
