import { useEffect, useState } from "react";
import RewardsBackground from "components/RewardsBackground";
import RewardsInfoBox from "components/RewardsInfoBox";
import { AnimatePresence, motion } from "framer-motion";
import { useChainContext } from "hooks/ChainContext";
import { getEthTotalPrizePool } from "data/ethereum/prizePool";
import { IPropPools } from "pages";

import styles from "./RewardsInitial.module.scss";

interface IProps {
  changeScreen: () => void;
  rewardPools: IPropPools;
}

const RewardsInitial = ({ changeScreen, rewardPools }: IProps) => {
  const { apiState, chain } = useChainContext();
  const { txCount } = apiState;

  const [prizePool, setPrizePool] = useState<string>(rewardPools.ethPool.toFixed(3));

  useEffect(() => {
    chain === `ETH` && 
    setPrizePool(rewardPools.ethPool.toFixed(3));

    chain === `SOL` && 
    setPrizePool(rewardPools.solPool.toFixed(3));

  },[chain]);
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={styles.container}
      >
        <RewardsInfoBox
          rewardPool={prizePool}
          totalTransactions={txCount}
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
