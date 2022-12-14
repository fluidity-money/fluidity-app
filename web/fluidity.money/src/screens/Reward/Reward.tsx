// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { useState } from "react";
import { IPropPools } from "pages";
import RewardsInitial from "screens/RewardsInitial";
import RewardStats from "screens/RewardsStats";
import styles from "./Reward.module.scss";

const Reward = (pools: IPropPools) => {
  /* Background of transactions info moving left and right cotinuously,
  Reward pool total with sol and eth toggle,
  click on prize total and switch screens to total transactions sol and eth,
  elements fade in and out then are conditionally removed
  */
  //sets which screen is present
  const [present, setPresent] = useState(true);

  return (
    <>
      <div className={styles.container}>
        {present ? (
          <RewardsInitial changeScreen={() => setPresent(!present)} rewardPools={pools} />
        ) : (
          <RewardStats changeScreen={() => setPresent(!present)} rewardPools={pools}/>
        )}
      </div>
    </>
  );
};

export default Reward;
