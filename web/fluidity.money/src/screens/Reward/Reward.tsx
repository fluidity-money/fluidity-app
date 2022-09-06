// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useState } from "react";
import useViewport from "hooks/useViewport";
import { useChainContext } from "hooks/ChainContext";
import RewardsBackground from "../../components/RewardsBackground";
import RewardsInfoBox from "../../components/RewardsInfoBox";
import { numberToMonetaryString } from "@fluidity-money/surfing";
import styles from "./Reward.module.scss";

const Reward = () => {
  /* Background of transactions info moving left and right cotinuously,
  Reward pool total with sol and eth toggle,
  click on prize total and switch screens to total transactions sol and eth,
  elements fade in and out then are conditionally removed
  */
  const { apiState } = useChainContext();
  const { txCount, rewardPool } = apiState;

  const [initalView, setInitalView] = useState(true);
  const [present, setPresent] = useState(true);
  const [toggle, setToggle] = useState(true);
  const { width } = useViewport();
  const breakpoint = 620;
  
  // animates then switches backgrounds
  const switchAndAnimate = () => {
    setInitalView(!initalView);
    setTimeout(() => {
      setPresent(!present);
    }, 1000);
  };

  // information on top of second screen
  const InfoStats = () => (
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
      {width > breakpoint && (
        <div className={styles.infoSingle}>
          <h1>{numberToMonetaryString(rewardPool)}</h1>
          <h4>Reward Pool</h4>
        </div>
      )}
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
          <InfoStats />
        </div>

        <RewardsInfoBox
          rewardPool={rewardPool}
          totalTransactionValue={txCount}
          toggle={toggle}
          setToggle={() => setToggle(!toggle)}
          initalView={initalView}
          switchAndAnimate={switchAndAnimate}
          type="black"
        />

        <RewardsInfoBox
          rewardPool={rewardPool}
          totalTransactionValue={txCount}
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
