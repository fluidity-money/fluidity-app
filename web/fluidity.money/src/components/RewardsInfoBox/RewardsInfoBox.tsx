// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.
import { Suspense, useEffect, useState } from "react";
import { useChainContext } from "hooks/ChainContext";
import useViewport from "hooks/useViewport";
import {
  BlockchainModal,
  ChainSelectorButton,
  SupportedChains,
  Heading,
} from "@fluidity-money/surfing";
import styles from "./RewardsInfoBox.module.scss";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

interface IRewardBoxProps {
  totalTransactions: number;
  changeScreen: () => void;
  type: "black" | "transparent";
}

const AnimatedNumbers = dynamic(() => import("react-animated-numbers"), {
  ssr: false,
});

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

  const [prizePool, setPrizePool] = useState<number>(Number(apiState.rewardPool.pools?.ethPool.toFixed(3)) || 0);

  useEffect(() => {
    chain === `ETH` && 
    setPrizePool(Number(apiState.rewardPool.pools?.ethPool.toFixed(3)) || 0);

    chain === `SOL` && 
    setPrizePool(Number(apiState.rewardPool.pools?.solPool.toFixed(3)) || 0);

  },[apiState.rewardPool.pools?.ethPool, apiState.rewardPool.pools?.solPool, chain]);
  
  useEffect(() => {
    if (!apiState.rewardPool.loading) return

    const interval = setInterval(() => {
      setPrizePool((prizePool) => {
        const random = Math.random() * 999999
        return Number(random.toFixed(3))
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
            {showRewardPool ? (
              <Suspense>
                <>
                  $<AnimatedNumbers animateToNumber={prizePool} includeComma />
                </>
              </Suspense>
            ) : (
              totalTransactions
            )}
          </Heading>
        </div>
        <Heading as="h4" className={styles.alignCenter}>
          {!apiState.rewardPool.loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {showRewardPool
                ? !apiState.rewardPool.loading && "Reward pool"
                : "Total transactions (on testing)"}
            </motion.div>
          )}
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
