import { useEffect, useState } from "react";
import RewardsBackground from "components/RewardsBackground";
import RewardsInfoBox from "components/RewardsInfoBox";
import { AnimatePresence, motion } from "framer-motion";
import { useChainContext } from "hooks/ChainContext";
import { getEthTotalPrizePool } from "data/ethereum/prizePool";

import styles from "./RewardsInitial.module.scss";

interface IProps {
  changeScreen: () => void;
}

const RewardsInitial = ({ changeScreen }: IProps) => {
  const { apiState, chain } = useChainContext();
  const { txCount } = apiState;

  const [prizePool, setPrizePool] = useState<string>("0");

  useEffect(() => {
    setPrizePool("0");
    
    chain === `ETH` && 
    getEthTotalPrizePool(process.env.NEXT_PUBLIC_FLU_ETH_RPC_HTTP)
      .then((value)=>{
        setPrizePool(value.toFixed(3));
      });
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
