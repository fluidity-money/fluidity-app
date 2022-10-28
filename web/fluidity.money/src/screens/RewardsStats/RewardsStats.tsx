import type { LargestDailyWinner } from "data/monthlyLargestWinners";

import {
  Heading,
  LineChart,
  numberToMonetaryString,
} from "@fluidity-money/surfing";
import RewardsInfoBox from "components/RewardsInfoBox";
import { AnimatePresence, motion } from "framer-motion";
import { useChainContext } from "hooks/ChainContext";
import useViewport from "hooks/useViewport";
import styles from "./RewardsStats.module.scss";

interface IProps {
  changeScreen: () => void;
}

const RewardsStats = ({ changeScreen }: IProps) => {
  const { apiState } = useChainContext();
  const { txCount, largestDailyWinnings } = apiState;
  const { width } = useViewport();
  const breakpoint = 620;
  
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
    
        <div className={styles.rewardsChart}>
          <LineChart 
            data= {dailyWinnersDummy}
            xLabel='Some X Label'
            yLabel='Some Y Label'
            lineLabel='Some Line Label'

            accessors={{
              xAccessor: (d: any) => d.awarded_time,
              yAccessor: (d: any) => d.winning_amount_scaled,
            }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RewardsStats;

const dailyWinnersDummy = [
  {
    network: "ethereum",
    transaction_hash: "0xhellotfatarftartarftartar",
    winning_address: "0xtftlefrahtoiarhouitnfroat",
    awarded_time: Date.parse("2022-08-01"),
    token_short_name: "fUSDC",
    winning_amount_scaled: 2,
  },
  {
    network: "ethereum",
    transaction_hash: "0xhellotfatarftartarftartar",
    winning_address: "0xtftlefrahtoiarhouitnfroat",
    awarded_time: Date.parse("2022-08-02"),
    token_short_name: "fUSDC",
    winning_amount_scaled: 1,
  },
  {
    network: "ethereum",
    transaction_hash: "0xhellotfatarftartarftartar",
    winning_address: "0xtftlefrahtoiarhouitnfroat",
    awarded_time: Date.parse("2022-08-03"),
    token_short_name: "fUSDC",
    winning_amount_scaled: 3,
  },
  {
    network: "ethereum",
    transaction_hash: "0xhellotfatarftartarftartar",
    winning_address: "0xtftlefrahtoiarhouitnfroat",
    awarded_time: Date.parse("2022-08-04"),
    token_short_name: "fUSDC",
    winning_amount_scaled: 5,
  },
  {
    network: "ethereum",
    transaction_hash: "0xhellotfatarftartarftartar",
    winning_address: "0xtftlefrahtoiarhouitnfroat",
    awarded_time: Date.parse("2022-08-05"),
    token_short_name: "fUSDC",
    winning_amount_scaled: 4,
  },
  {
    network: "ethereum",
    transaction_hash: "0xhellotfatarftartarftartar",
    winning_address: "0xtftlefrahtoiarhouitnfroat",
    awarded_time: Date.parse("2022-08-06"),
    token_short_name: "fUSDC",
    winning_amount_scaled: 7,
  },
  {
    network: "ethereum",
    transaction_hash: "0xhellotfatarftartarftartar",
    winning_address: "0xtftlefrahtoiarhouitnfroat",
    awarded_time: Date.parse("2022-08-07"),
    token_short_name: "fUSDC",
    winning_amount_scaled: 10,
  },
  {
    network: "ethereum",
    transaction_hash: "0xhellotfatarftartarftartar",
    winning_address: "0xtftlefrahtoiarhouitnfroat",
    awarded_time: Date.parse("2022-08-08"),
    token_short_name: "fUSDC",
    winning_amount_scaled: 8,
  },
  {
    network: "ethereum",
    transaction_hash: "0xhellotfatarftartarftartar",
    winning_address: "0xtftlefrahtoiarhouitnfroat",
    awarded_time: Date.parse("2022-08-09"),
    token_short_name: "fUSDC",
    winning_amount_scaled: 10,
  },
  {
    network: "ethereum",
    transaction_hash: "0xhellotfatarftartarftartar",
    winning_address: "0xtftlefrahtoiarhouitnfroat",
    awarded_time: Date.parse("2022-08-10"),
    token_short_name: "fUSDC",
    winning_amount_scaled: 9,
  },
  {
    network: "ethereum",
    transaction_hash: "0xhellotfatarftartarftartar",
    winning_address: "0xtftlefrahtoiarhouitnfroat",
    awarded_time: Date.parse("2022-08-11"),
    token_short_name: "fUSDC",
    winning_amount_scaled: 13,
  },
  {
    network: "ethereum",
    transaction_hash: "0xheltlotfatarftartarftartar",
    winning_address: "0xtftlefrahtoiarhouifnfroat",
    awarded_time: Date.parse("2022-08-12"),
    token_short_name: "tUSDC",
    winning_amount_scaled: 12,
  },
  {
    network: "ethereum",
    transaction_hash: "0xhellotfattrftartarftartar",
    winning_address: "0xtftlefrahtoiarhofitnfroat",
    awarded_time: Date.parse("2022-08-13"),
    token_short_name: "USDC",
    winning_amount_scaled: 11,
  },
]


