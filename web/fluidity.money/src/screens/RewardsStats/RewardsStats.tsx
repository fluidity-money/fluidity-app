import type { LargestDailyWinner } from "data/monthlyLargestWinners";

import {
  Heading,
  LineChart,
  numberToMonetaryString,
  trimAddress,
} from "@fluidity-money/surfing";
import RewardsInfoBox from "components/RewardsInfoBox";
import { AnimatePresence, motion } from "framer-motion";
import { useChainContext } from "hooks/ChainContext";
import useViewport from "hooks/useViewport";
import styles from "./RewardsStats.module.scss";

interface IProps {
  changeScreen: () => void;
}

type DailyWinner = LargestDailyWinner & {
  awarded_date: Date,
}

const RewardsStats = ({ changeScreen }: IProps) => {
  const { apiState } = useChainContext();
  const { txCount, largestDailyWinnings } = apiState;
  const { width } = useViewport();
  const breakpoint = 620;
  
  // NOTE: Dummy data
  const parsedDailyWinnings = largestDailyWinnings
    .map(({awarded_day, ...reward}) => (
      {
        ...reward,
        awarded_date: new Date(awarded_day),
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
        <Heading as={width > breakpoint ? "h2" : "h3"}>12</Heading>
        <Heading as={width > breakpoint ? "h5" : "h6"}>
          Fluid asset pairs
        </Heading>
      </div>
      {width > breakpoint && (
        <div className={styles.infoSingle}>
          {/* NOTE: Dummy data */}
          <Heading as="h2">$100,000</Heading>
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
          rewardPool={100000}
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
                xAccessor: (d: DailyWinner) => d.awarded_date,
                yAccessor: (d: DailyWinner) => d.winning_amount_scaled,
              }}
              renderTooltip={({datum}: {datum: DailyWinner}) => {
                return (
                  <div className={styles.tooltip}>
                    <span style={{ color: "rgba(255,255,255, 50%)" }}>
                      {`${datum.awarded_date.getDate()}`.padStart(2,'0')}/
                      {`${datum.awarded_date.getMonth() + 1}`.padStart(2,'0')}/
                      {`${datum.awarded_date.getUTCFullYear() % 100}`.padStart(2,'0')}
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

