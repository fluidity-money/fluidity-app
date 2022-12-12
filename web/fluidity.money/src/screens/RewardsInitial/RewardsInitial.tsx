import { useEffect, useState } from "react";
import RewardsBackground from "components/RewardsBackground";
import RewardsInfoBox from "components/RewardsInfoBox";
import { AnimatePresence, motion } from "framer-motion";
import { useChainContext } from "hooks/ChainContext";

import styles from "./RewardsInitial.module.scss";

interface IProps {
  changeScreen: () => void;
}

const RewardsInitial = ({ changeScreen }: IProps) => {
  const { apiState, chain } = useChainContext();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={styles.container}
      >
        <RewardsInfoBox
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
