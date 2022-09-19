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
  const { txCount, rewardPool } = apiState;
  const { width } = useViewport();
  const breakpoint = 620;

  // information on top of second screen
  const InfoStats = () => (
    <div className={styles.info}>
      <div className={styles.infoSingle}>
        {/* hard coded on launch */}
        <Heading as={width > breakpoint ? "h2" : "h3"}>1400+</Heading>
        <Heading as={width > breakpoint ? "h5" : "h6"}>Unique wallets</Heading>
      </div>
      <div className={styles.infoSingle}>
        {/* hard coded on launch */}
        <Heading as={width > breakpoint ? "h2" : "h3"}>32,689</Heading>
        <Heading as={width > breakpoint ? "h5" : "h6"}>
          Fluid asset pairs
        </Heading>
      </div>
      {width > breakpoint && (
        <div className={styles.infoSingle}>
          <Heading as="h2">{numberToMonetaryString(rewardPool)}</Heading>
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
        <div style={{ height: 254, width: "100%" }}>
          {/* <LineChart
            data={[
              { x: 10, y: 5 },
              { x: 20, y: 15 },
              { x: 30, y: 10 },
              { x: 40, y: 15 },
              { x: 50, y: 20 },
              { x: 60, y: 22 },
              { x: 70, y: 30 },
              { x: 80, y: 25 },
            ]}
            xLabel={"Date"}
            yLabel={"Prize Amount"}
            lineLabel={"Transactions"}
            accessors={{
              xAccessor: (d: any) => {
                return d.x as any;
              },
              yAccessor: (d: any) => {
                return d.y as any;
              },
            }}
          /> */}
        </div>

        <RewardsInfoBox
          rewardPool={rewardPool}
          totalTransactionValue={txCount}
          changeScreen={changeScreen}
          type="transparent"
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default RewardsStats;
