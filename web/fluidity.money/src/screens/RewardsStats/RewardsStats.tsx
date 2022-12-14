import { useEffect, useState } from "react";

import {
  Heading,
  LineChart,
  numberToMonetaryString,
  trimAddress,
} from "@fluidity-money/surfing";

import type { LargestDailyWinner } from "data/monthlyLargestWinners";
import { getEthTotalPrizePool } from "data/ethereum/prizePool";
import RewardsInfoBox from "components/RewardsInfoBox";
import { AnimatePresence, motion } from "framer-motion";
import { useChainContext } from "hooks/ChainContext";
import useViewport from "hooks/useViewport";

import styles from "./RewardsStats.module.scss";
import { IPropPools } from "pages";

interface IProps {
  changeScreen: () => void;
  rewardPools: IPropPools;
}

type DailyWinner = LargestDailyWinner & {
  awarded_day: Date,
}

const RewardsStats = ({ changeScreen, rewardPools}: IProps) => {
  const { apiState, chain } = useChainContext();
  const { txCount, largestDailyWinnings } = apiState;
  const { width } = useViewport();
  const breakpoint = 620;

  const [prizePool, setPrizePool] = useState<string>(rewardPools.ethPool.toFixed(3));

  useEffect(() => {
    chain === `ETH` && 
    setPrizePool(rewardPools.ethPool.toFixed(3));

    chain === `SOL` && 
    setPrizePool(rewardPools.solPool.toFixed(3));

  },[chain]);

  // NOTE: Dummy data
  const parsedDailyWinnings = largestDailyWinnings
    .map(({awarded_day, ...reward}) => (
      {
        ...reward,
        awarded_day: new Date(awarded_day),
      }
    ))

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
        <Heading as={width > breakpoint ? "h2" : "h3"}>5</Heading>
        <Heading as={width > breakpoint ? "h5" : "h6"}>
          Fluid asset pairs
        </Heading>
      </div>
      {width > breakpoint && (
        <div className={styles.infoSingle}>
          {/* NOTE: Dummy data */}
          <Heading as="h2">${prizePool}</Heading>
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
          rewardPool={prizePool}
          totalTransactions={txCount}
          changeScreen={changeScreen}
          type="transparent"
        />
        {!!parsedDailyWinnings.length && (
          <div className={styles.rewardsChart}>
            <LineChart 
              data= {parsedDailyWinnings}
              lineLabel='dailyWinnings'
              accessors={{
                xAccessor: (w: LargestDailyWinner) => w.awarded_day,
                yAccessor: (w: LargestDailyWinner) => w.winning_amount_scaled * 1000000 + 1,
              }}
              renderTooltip={({datum}: {datum: DailyWinner}) => {
                return (
                  <div className={styles.tooltip}>
                    <span style={{ color: "rgba(255,255,255, 50%)" }}>
                      {`${datum.awarded_day.getDate()}`.padStart(2,'0')}/
                      {`${datum.awarded_day.getMonth() + 1}`.padStart(2,'0')}/
                      {`${datum.awarded_day.getUTCFullYear() % 100}`.padStart(2,'0')}
                    </span>
                    <br/>
                    <br />
                    <span>
                      <span>{trimAddress(datum.winning_address)}</span>
                    </span>
                    <br/>
                    <br/>
                    <span>
                      <span>{numberToMonetaryString(datum.winning_amount_scaled)}{" "}</span>
                      <span style={{ color: "rgba(2555,255,255, 50%)" }}>
                        prize awarded
                      </span>
                    </span>
                  </div>
                )
              }}
            />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default RewardsStats;