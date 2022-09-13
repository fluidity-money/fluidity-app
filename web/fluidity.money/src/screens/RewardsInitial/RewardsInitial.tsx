import RewardsBackground from "components/RewardsBackground";
import RewardsInfoBox from "components/RewardsInfoBox";
import { useChainContext } from "hooks/ChainContext";
import useViewport from "hooks/useViewport";
import { useState } from "react";
import styles from "./RewardsInitial.module.scss";

const RewardsInitial = () => {
  const { apiState } = useChainContext();
  const { txCount, rewardPool } = apiState;

  const [initalView, setInitalView] = useState(true);
  const [present, setPresent] = useState(true);
  const [toggle, setToggle] = useState(true);
  const { width } = useViewport();
  const breakpoint = 620;

  return (
    <div className={styles.container}>
      <RewardsInfoBox
        rewardPool={rewardPool}
        totalTransactionValue={txCount}
        toggle={toggle}
        setToggle={() => setToggle(!toggle)}
        initalView={initalView}
        switchAndAnimate={() => {}}
        type="black"
      />
      <div className={styles.rewardsBackground}>
        <RewardsBackground />
      </div>
    </div>
  );
};

export default RewardsInitial;
