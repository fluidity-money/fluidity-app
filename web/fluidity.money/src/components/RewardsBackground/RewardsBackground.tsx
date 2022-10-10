// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

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

const RewardsBackground = () => {
  const { apiState } = useChainContext();
  const { ref, inView } = useInView();
  const { width } = useViewport();

  const rewards: Reward[] = apiState.weekWinnings.map((winning) => ({
    token: winning.token_short_name,
    amount: winning.winning_amount,
    address: winning.winning_address,
    date: new Date(winning.awarded_time),
    transaction: winning.transaction_hash,
  }));

  const carouselVariants = {
    appear: { x: 0 },
  };

  const carouselInfo = (
    <div>
      {rewards
        .slice(10)
        .map(({ token, amount, address, date, transaction }, i) => (
          <div key={`winner-${i}`} className={styles.winner}>
            <a
              href={`https://etherscan.io/tx/${transaction}`}
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
        {Array(10).map(() => (
          <>
            <motion.div
              initial={width < 500 ? { x: -500 } : { x: 1500 }}
              variants={carouselVariants}
              animate={inView && "appear"}
              transition={{ type: "tween", duration: 5 }}
            >
              <ContinuousCarousel background={true} direction="right">
                {carouselInfo}
              </ContinuousCarousel>
            </motion.div>
            <motion.div
              initial={width < 500 ? { x: 500 } : { x: 1500 }}
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

const dummyRewards = [
  {
    token: "USDC",
    amount: 234405,
    address: "asdasa0093lsdn",
    date: new Date(),
    transaction: "0xflfjefnl88",
  },
  {
    token: "USDC",
    amount: 234405,
    address: "asdasa0093lsdn",
    date: new Date(),
    transaction: "0xflfjefnl88",
  },
  {
    token: "USDC",
    amount: 234405,
    address: "asdasa0093lsdn",
    date: new Date(),
    transaction: "0xflfjefnl88",
  },
  {
    token: "USDC",
    amount: 234405,
    address: "asdasa0093lsdn",
    date: new Date(),
    transaction: "0xflfjefnl88",
  },
  {
    token: "USDC",
    amount: 234405,
    address: "asdasa0093lsdn",
    date: new Date(),
    transaction: "0xflfjefnl88",
  },
  {
    token: "USDC",
    amount: 234405,
    address: "asdasa0093lsdn",
    date: new Date(),
    transaction: "0xflfjefnl88",
  },
  {
    token: "USDC",
    amount: 234405,
    address: "asdasa0093lsdn",
    date: new Date(),
    transaction: "0xflfjefnl88",
  },
  {
    token: "USDC",
    amount: 234405,
    address: "asdasa0093lsdn",
    date: new Date(),
    transaction: "0xflfjefnl88",
  },
  {
    token: "USDC",
    amount: 234405,
    address: "asdasa0093lsdn",
    date: new Date(),
    transaction: "0xflfjefnl88",
  },
  {
    token: "USDC",
    amount: 234405,
    address: "asdasa0093lsdn",
    date: new Date(),
    transaction: "0xflfjefnl88",
  },
  {
    token: "USDC",
    amount: 234405,
    address: "asdasa0093lsdn",
    date: new Date(),
    transaction: "0xflfjefnl88",
  },
  {
    token: "USDC",
    amount: 234405,
    address: "asdasa0093lsdn",
    date: new Date(),
    transaction: "0xflfjefnl88",
  },
  {
    token: "USDC",
    amount: 234405,
    address: "asdasa0093lsdn",
    date: new Date(),
    transaction: "0xflfjefnl88",
  },
  {
    token: "USDC",
    amount: 234405,
    address: "asdasa0093lsdn",
    date: new Date(),
    transaction: "0xflfjefnl88",
  },
  {
    token: "USDC",
    amount: 234405,
    address: "asdasa0093lsdn",
    date: new Date(),
    transaction: "0xflfjefnl88",
  },
  {
    token: "USDC",
    amount: 234405,
    address: "asdasa0093lsdn",
    date: new Date(),
    transaction: "0xflfjefnl88",
  },
  {
    token: "USDC",
    amount: 234405,
    address: "asdasa0093lsdn",
    date: new Date(),
    transaction: "0xflfjefnl88",
  },
  {
    token: "USDC",
    amount: 234405,
    address: "asdasa0093lsdn",
    date: new Date(),
    transaction: "0xflfjefnl88",
  },
  {
    token: "USDC",
    amount: 234405,
    address: "asdasa0093lsdn",
    date: new Date(),
    transaction: "0xflfjefnl88",
  },
  {
    token: "USDC",
    amount: 234405,
    address: "asdasa0093lsdn",
    date: new Date(),
    transaction: "0xflfjefnl88",
  },
];
