import {
  Heading,
  LineChart,
  numberToMonetaryString,
} from "@fluidity-money/surfing";
import RewardsInfoBox from "components/RewardsInfoBox";
import { useChainContext } from "hooks/ChainContext";
import useViewport from "hooks/useViewport";
import { useState } from "react";
import styles from "./RewardsStats.module.scss";

const RewardsStats = () => {
  const { apiState } = useChainContext();
  const { txCount, rewardPool } = apiState;

  const [initalView, setInitalView] = useState(false);
  const [present, setPresent] = useState(true);
  const [toggle, setToggle] = useState(false);
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
    <div className={styles.container}>
      <div className={initalView ? `${styles.stats} ` : `${styles.stats} `}>
        <InfoStats />
      </div>
      <div style={{ height: 254, width: "100%" }}>
        <LineChart
          data={[
            { x: 10, y: 10 },
            { x: 20, y: 20 },
            { x: 30, y: 30 },
            { x: 40, y: 20 },
          ]}
          xLabel={"Some X Label"}
          yLabel={"Some Y Label"}
          lineLabel={"Some Line Label"}
          accessors={{
            xAccessor: (d: any) => {
              return d.x as any;
            },
            yAccessor: (d: any) => {
              return d.y as any;
            },
          }}
        />
      </div>

      <RewardsInfoBox
        rewardPool={rewardPool}
        totalTransactionValue={txCount}
        toggle={toggle}
        setToggle={() => setToggle(!toggle)}
        initalView={initalView}
        switchAndAnimate={() => {}}
        type="transparent"
      />
    </div>
  );
};

export default RewardsStats;
