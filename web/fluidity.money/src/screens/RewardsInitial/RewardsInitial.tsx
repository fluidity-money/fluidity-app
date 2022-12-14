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
  const { txCount } = apiState;

  const [prizePool, setPrizePool] = useState<number>(apiState.rewardPool.pools?.ethPool || 0);

  useEffect(() => {
    chain === `ETH` && 
    setPrizePool(apiState.rewardPool.pools?.ethPool || 0);

    chain === `SOL` && 
    setPrizePool(apiState.rewardPool.pools?.solPool || 0);

  },[apiState.rewardPool.pools?.ethPool, apiState.rewardPool.pools?.solPool, chain]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={styles.container}
      >
        <RewardsInfoBox
          totalTransactions={txCount}
          changeScreen={changeScreen}
          type="black"
          loading={apiState.rewardPool.loading}
          rewardPool={prizePool}
          key={`${apiState.rewardPool.loading}-${prizePool}`}
        />
        <div className={styles.rewardsBackground}>
          <RewardsBackground />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RewardsInitial;
