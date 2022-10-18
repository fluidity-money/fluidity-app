import {
  Heading,
  LineChart,
  numberToMonetaryString,
} from "@fluidity-money/surfing";
import RewardsInfoBox from "components/RewardsInfoBox";
import { AnimatePresence, motion } from "framer-motion";
import { useChainContext } from "hooks/ChainContext";
import useViewport from "hooks/useViewport";
import { useState } from "react";
import styles from "./RewardsStats.module.scss";

interface IProps {
  changeScreen: () => void;
}

const RewardsStats = ({ changeScreen }: IProps) => {
  const { apiState } = useChainContext();
  const { txCount } = apiState;
  const { width } = useViewport();
  const breakpoint = 620;

  // information on top of second screen
  const InfoStats = () => (
    <div className={styles.info}>
      <div className={styles.infoSingle}>
        {/* hard coded on launch */}
        <Heading as={width > breakpoint ? "h2" : "h3"}>35,000+</Heading>
        <Heading
          className={styles.alignCenter}
          as={width > breakpoint ? "h5" : "h6"}
        >
          Unique wallets (on testing)
        </Heading>
      </div>
      <div className={styles.infoSingle}>
        {/* hard coded on launch */}
        <Heading as={width > breakpoint ? "h2" : "h3"}>12</Heading>
        <Heading as={width > breakpoint ? "h5" : "h6"}>
          Fluid asset pairs
        </Heading>
      </div>
      {width > breakpoint && (
        <div className={styles.infoSingle}>
          {/* NOTE: Dummy data */}
          <Heading as="h2">$100,000</Heading>
          <Heading as="h5">Reward Pool</Heading>
        </div>
      )}
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={styles.container}
      >
        <div className={`${styles.stats} `}>
          <InfoStats />
        </div>
        <div style={{ height: 254, width: "100%" }}></div>

        <RewardsInfoBox
          // NOTE: Dummy data
          rewardPool={100000}
          totalTransactions={txCount}
          changeScreen={changeScreen}
          type="transparent"
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default RewardsStats;
