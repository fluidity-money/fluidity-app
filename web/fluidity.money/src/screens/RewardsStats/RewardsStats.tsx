import { useEffect, useState } from "react";

import {
  Heading,
  LineChart,
  numberToMonetaryString,
  trimAddress,
} from "@fluidity-money/surfing";

import type { LargestDailyWinner } from "data/monthlyLargestWinners";
import RewardsInfoBox from "components/RewardsInfoBox";
import { AnimatePresence, motion } from "framer-motion";
import { useChainContext } from "hooks/ChainContext";
import useViewport from "hooks/useViewport";

import styles from "./RewardsStats.module.scss";

interface IProps {
  changeScreen: () => void;
}

type DailyWinner = LargestDailyWinner & {
  awarded_day: Date,
}

const RewardsStats = ({ changeScreen }: IProps) => {
  const { apiState, chain } = useChainContext();
  const { largestDailyWinnings, onChainData } = apiState;
  const { width } = useViewport();
  const breakpoint = 620;

  const [prizePool, setPrizePool] = useState<string>(onChainData.data?.ethPool.toFixed(3) || `0`);

  useEffect(() => {
    chain === `ETH` && 
    setPrizePool(onChainData.data?.ethPool.toFixed(3) || `0`);

    chain === `SOL` && 
    setPrizePool(onChainData.data?.solPool.toFixed(3) || `0`);

  },[onChainData.data?.ethPool, onChainData.data?.solPool, chain]);

  useEffect(() => {
    if (!onChainData.loading) return

    const interval = setInterval(() => {
      setPrizePool((prizePool) => {
        const random = Math.random() * 200000
        return random.toFixed(3)
      })
    } , 100)

    return () => clearInterval(interval)
  }, [onChainData.loading])

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
          <Heading as="h2">{numberToMonetaryString(Number(prizePool))}</Heading>
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
                yAccessor: (w: LargestDailyWinner) => w.winning_amount_scaled,
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
