import { useEffect, useState } from "react";
import RewardsBackground from "components/RewardsBackground";
import RewardsInfoBox from "components/RewardsInfoBox";
import { AnimatePresence, motion } from "framer-motion";
import { useChainContext } from "hooks/ChainContext";
import { getEthTotalPrizePool } from "data/ethereum/prizePool";
import { IPropOnChainData } from "pages";

import styles from "./RewardsInitial.module.scss";

interface IProps {
  changeScreen: () => void;
  data: IPropOnChainData;
}

const RewardsInitial = ({ changeScreen, data }: IProps) => {
  const { apiState, chain } = useChainContext();
	

  const [prizePool, setPrizePool] = useState<string>(data.ethPool.toFixed(3));
  const [totalTx, setTotalTx] = useState<number>(0);
  useEffect(() => {
    chain === `ETH` && 
    setPrizePool(data.ethPool.toFixed(3));

    chain === `SOL` && 
    setPrizePool(data.solPool.toFixed(3));

		setTotalTx(data.totalTransactions);
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
          totalTransactions={totalTx}
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
