// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useState } from "react";
import useViewport from "hooks/useViewport";
import { useChainContext } from "hooks/ChainContext";
import RewardsBackground from "../../components/RewardsBackground";
import RewardsInfoBox from "../../components/RewardsInfoBox";
import { Heading, numberToMonetaryString } from "@fluidity-money/surfing";
import styles from "./Reward.module.scss";
import RewardsInitial from "screens/RewardsInitial";
import RewardStats from "screens/RewardsStats";

const Reward = () => {
  /* Background of transactions info moving left and right cotinuously,
  Reward pool total with sol and eth toggle,
  click on prize total and switch screens to total transactions sol and eth,
  elements fade in and out then are conditionally removed
  */
  const { apiState } = useChainContext();
  const { txCount, rewardPool } = apiState;

  const [initalView, setInitalView] = useState(false);
  const [present, setPresent] = useState(true);
  const [toggle, setToggle] = useState(false);
  const { width } = useViewport();
  const breakpoint = 620;

  // animates then switches backgrounds
  const switchAndAnimate = () => {
    setInitalView(!initalView);
    setTimeout(() => {
      setPresent(!present);
    }, 1000);
  };

  return (
    <>
      <div className={styles.container}>
        {!present ? <RewardsInitial /> : <RewardStats />}
      </div>
    </>
  );
};

export default Reward;
