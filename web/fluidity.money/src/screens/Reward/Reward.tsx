// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useState } from "react";
import useViewport from "hooks/useViewport";
import { useChainContext } from "hooks/ChainContext";
import RewardsBackground from "../../components/RewardsBackground";
import RewardsInfoBox from "../../components/RewardsInfoBox";
import { Heading, numberToMonetaryString } from "@fluidity-money/surfing";
import RewardsInitial from "screens/RewardsInitial";
import RewardStats from "screens/RewardsStats";
import styles from "./Reward.module.scss";

const Reward = () => {
  /* Background of transactions info moving left and right cotinuously,
  Reward pool total with sol and eth toggle,
  click on prize total and switch screens to total transactions sol and eth,
  elements fade in and out then are conditionally removed
  */
  const { apiState } = useChainContext();
  const { txCount, rewardPool } = apiState;
  //sets which screen is present
  const [present, setPresent] = useState(true);
  const { width } = useViewport();
  const breakpoint = 620;

  return (
    <>
      <div className={styles.container}>
        {present ? (
          <RewardsInitial changeScreen={() => setPresent(!present)} />
        ) : (
          <RewardStats changeScreen={() => setPresent(!present)} />
        )}
      </div>
    </>
  );
};

export default Reward;
