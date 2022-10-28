// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { useChainContext } from "hooks/ChainContext";
import {
  ContinuousCarousel,
  numberToMonetaryString,
  trimAddressShort,
  formatTo12HrDate,
  Text,
} from "@fluidity-money/surfing";
import styles from "./RewardsBackground.module.scss";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import useViewport from "hooks/useViewport";

interface Reward {
  token: string;
  amount: number;
  address: string;
  date: Date;
  transaction: string;
}

const rewardLimit = 20;

const RewardsBackground = () => {
  const { apiState, chain, network } = useChainContext();
  const { ref, inView } = useInView();
  const { width } = useViewport();
  const { weekWinnings } = apiState;

  const rewards: Reward[] = weekWinnings.map((winning) => ({
    token: winning.token_short_name,
    amount: winning.winning_amount / 10 ** winning.token_decimals,
    address: winning.winning_address,
    date: new Date(winning.awarded_time),
    transaction: winning.transaction_hash,
  }));

  const carouselVariants = {
    appear: { x: 0 },
  };

  const txExplorerUrl = (txHash: string) => {
    switch (true) {
      case chain === "ETH" && network === "STAGING":
        return `https://ropsten.etherscan.io/tx/${txHash}`;
      case chain === "ETH" && network === "MAINNET":
        return `https://etherscan.io/tx/${txHash}`;
      case chain === "SOL" && network === "STAGING":
        return `https://explorer.solana.com/tx/${txHash}?cluster=devnet`;
      case chain === "SOL" && network === "MAINNET":
        return `https://explorer.solana.com/tx/${txHash}`;
    }
  };

  const carouselInfo = (
    <div>
      {rewards
        .slice(rewardLimit)
        .map(({ token, amount, address, date, transaction }, i) => (
          <div key={`winner-${i}`} className={styles.winner}>
            <a
              href={txExplorerUrl(transaction)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={
                  token === "USDT"
                    ? "/assets/images/tokenIcons/usdt.svg"
                    : "/assets/images/tokenIcons/usdc.svg"
                }
                alt="tokenIcon"
              />

              <Text as="p" prominent={true} className={styles.hover}>
                {numberToMonetaryString(amount)}{" "}
              </Text>

              <Text as="p" className={styles.hover}>
                {`sent to`}{" "}
              </Text>

              <Text as="p" className={styles.hoverUnderline}>
                {`${trimAddressShort(address)}`}{" "}
              </Text>

              <Text as="p" className={styles.hover}>
                {formatTo12HrDate(date)}
              </Text>
            </a>
          </div>
        ))}
    </div>
  );
  return (
    <div className={styles.container}>
      <div className={styles.shade}></div>
      <div className={styles.rewardsBackground} ref={ref}>
        {Array.from({ length: rewardLimit }).map(() => (
          <>
            <motion.div
              initial={width < 500 && width > 0 ? { x: -500 } : { x: -1500 }}
              variants={carouselVariants}
              animate={inView && "appear"}
              transition={{ type: "tween", duration: 5 }}
            >
              <ContinuousCarousel background={true} direction="right">
                {carouselInfo}
              </ContinuousCarousel>
            </motion.div>
            <motion.div
              initial={width < 500 && width > 0 ? { x: 500 } : { x: 1500 }}
              variants={carouselVariants}
              animate={inView && "appear"}
              transition={{ type: "tween", duration: 5 }}
            >
              <ContinuousCarousel background={true} direction="left">
                {carouselInfo}
              </ContinuousCarousel>
            </motion.div>
          </>
        ))}
      </div>
    </div>
  );
};

export default RewardsBackground;
