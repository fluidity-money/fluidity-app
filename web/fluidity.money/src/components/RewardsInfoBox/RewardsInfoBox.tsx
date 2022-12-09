// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.
import AnimatedNumbers from "react-animated-numbers"
import { useEffect, useState } from "react";
import { useChainContext } from "hooks/ChainContext";
import useViewport from "hooks/useViewport";
import {
  BlockchainModal,
  ChainSelectorButton,
  stringifiedNumberToMonetaryString,
  SupportedChains,
  Heading,
} from "@fluidity-money/surfing";
import styles from "./RewardsInfoBox.module.scss";

interface IRewardBoxProps {
  totalTransactions: number;
  changeScreen: () => void;
  type: "black" | "transparent";
}

const RewardsInfoBox = ({
  totalTransactions,
  changeScreen,
  type,
}: IRewardBoxProps) => {
  const { apiState, chain, setChain } = useChainContext();

  const showRewardPool = type === "black";

  const imgLink = (opt: string) =>
    opt === "ETH"
      ? "/assets/images/chainIcons/ethIcon.svg"
      : "/assets/images/chainIcons/solanaIcon.svg";

  const [showModal, setShowModal] = useState(false);

  const { width } = useViewport();
  const mobileBreakpoint = 620;

  const options = Object.keys(SupportedChains).map((chain) => ({
    name: chain,
    icon: <img src={imgLink(chain)} alt={`${chain}-icon`} />,
  }));

  const [prizePool, setPrizePool] = useState<string>(apiState.rewardPool.pools?.ethPool.toFixed(3) || `0`);

  useEffect(() => {
    chain === `ETH` && 
    setPrizePool(apiState.rewardPool.pools?.ethPool.toFixed(3) || `0`);

    chain === `SOL` && 
    setPrizePool(apiState.rewardPool.pools?.solPool.toFixed(3) || `0`);

  },[apiState.rewardPool.pools?.ethPool, apiState.rewardPool.pools?.solPool, chain]);
  
  useEffect(() => {
    if (!apiState.rewardPool.loading) return

    const interval = setInterval(() => {
      setPrizePool((prizePool) => {
        const random = Math.random() * 200000
        return random.toFixed(3)
      })
    } , 200)

    return () => clearInterval(interval)
  }, [apiState.rewardPool.loading])

  return (
    <div
      className={`${
        type === "black"
          ? styles.infoBoxContainer
          : styles.infoBoxContainerStats
      }`}
    >
      <div
        className={
          type === "black" ? styles.infoBox : styles.infoBoxTransparent
        }
      >
        <ChainSelectorButton
          chain={{
            name: chain,
            icon: <img src={imgLink(chain)} alt={`${chain}-selected`} />,
          }}
          onClick={() => setShowModal(true)}
        />
        <div onClick={changeScreen}>
          <Heading as="h1">
            {showRewardPool
              ? prizePool
              : totalTransactions}
          </Heading>
        </div>
        <Heading as="h4" className={styles.alignCenter}>
          {showRewardPool ? "Reward pool" : "Total transactions (on testing)"}
        </Heading>
        {showModal && (
          <BlockchainModal
            handleModal={setShowModal}
            option={{
              name: chain,
              icon: <img src={imgLink(chain)} alt={`${chain}-selected`} />,
            }}
            className={styles.overlap}
            options={options}
            setOption={setChain}
            mobile={width <= mobileBreakpoint}
          />
        )}
        {/* <LinkButton size={"medium"} type={"internal"} handleClick={() => {}}>
          FLUID STATS
        </LinkButton> */}
      </div>
    </div>
  );
};

export default RewardsInfoBox;
