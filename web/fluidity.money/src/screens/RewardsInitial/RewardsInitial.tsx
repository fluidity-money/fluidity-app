import { useEffect, useState } from "react";
import RewardsBackground from "components/RewardsBackground";
import RewardsInfoBox from "components/RewardsInfoBox";
import { AnimatePresence, motion } from "framer-motion";
import { useChainContext } from "hooks/ChainContext";
import { getEthTotalPrizePool } from "data/ethereum/prizePool";

import styles from "./RewardsInitial.module.scss";
import { Pools } from "pageBody/LandingPage/LandingPage";

interface IProps {
  changeScreen: () => void;
  rewardPools: Pools;
  loading: boolean
}

const RewardsInitial = ({ changeScreen, rewardPools, loading }: IProps) => {
  const { apiState, chain } = useChainContext();
  const { txCount } = apiState;

  const [prizePool, setPrizePool] = useState<string>(rewardPools.ethPool.toFixed(3));

  useEffect(() => {
    chain === `ETH` && 
    setPrizePool(rewardPools.ethPool.toFixed(3));

    chain === `SOL` && 
    setPrizePool(rewardPools.solPool.toFixed(3));

  },[chain]);
  
  useEffect(() => {
    if (!loading) return

    const interval = setInterval(() => {
      setPrizePool((prizePool) => {
        const random = Math.random() * 200000
        return random.toFixed(3)
      })
    } , 200)

    return () => clearInterval(interval)
  }, [loading])

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
