import { useEffect, useState } from "react";
import RewardsBackground from "components/RewardsBackground";
import RewardsInfoBox from "components/RewardsInfoBox";
import { AnimatePresence, motion } from "framer-motion";
import { useChainContext } from "hooks/ChainContext";

import styles from "./RewardsInitial.module.scss";

interface IProps {
  changeScreen: () => void;
  carouselInfo: React.ReactNode[]
}

const RewardsInitial = ({ changeScreen, carouselInfo }: IProps) => {
  const { apiState, chain } = useChainContext();
  const { onChainData } = apiState;

  const [prizePool, setPrizePool] = useState<number>(onChainData.data?.ethPool || 0);

  useEffect(() => {
    chain === `ETH` && 
    setPrizePool(onChainData.data?.ethPool || 0);

    chain === `SOL` && 
    setPrizePool(onChainData.data?.solPool || 0);

  },[onChainData.data?.ethPool, onChainData.data?.solPool, chain]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={styles.container}
      >
        <RewardsInfoBox
          totalTransactions={onChainData.data?.totalTransactions}
          changeScreen={changeScreen}
          type="black"
          loading={apiState.onChainData.loading}
          rewardPool={prizePool}
          key={`${apiState.onChainData.loading}-${prizePool}`}
        />
        <div className={styles.rewardsBackground}>
          <RewardsBackground carouselInfo={carouselInfo}/>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RewardsInitial;
