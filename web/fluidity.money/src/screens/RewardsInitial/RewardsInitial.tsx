import RewardsBackground from "components/RewardsBackground";
import RewardsInfoBox from "components/RewardsInfoBox";
import { AnimatePresence, motion } from "framer-motion";
import { useChainContext } from "hooks/ChainContext";
import useViewport from "hooks/useViewport";
import { useState } from "react";
import styles from "./RewardsInitial.module.scss";

interface IProps {
  changeScreen: () => void;
}

const RewardsInitial = ({ changeScreen }: IProps) => {
  const { apiState } = useChainContext();
  const { txCount, rewardPool } = apiState;
  const { width } = useViewport();
  const breakpoint = 620;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={styles.container}
      >
        <RewardsInfoBox
          rewardPool={rewardPool}
          totalTransactionValue={txCount}
          changeScreen={changeScreen}
          type="black"
        />
        <div className={styles.rewardsBackground}>
          <RewardsBackground />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RewardsInitial;
