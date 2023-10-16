// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.
import { Suspense, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useChainContext } from "hooks/ChainContext";
import {
  BlockchainModal,
  ChainSelectorButton,
  SupportedChains,
  Heading,
  useViewport,
  LoadingDots,
} from "@fluidity-money/surfing";
import styles from "./RewardsInfoBox.module.scss";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

interface IRewardBoxProps {
  totalTransactions: number;
  changeScreen: () => void;
  type: "black" | "transparent";
  rewardPool?: number;
  loading: boolean;
}

const AnimatedNumbers = dynamic(() => import("react-animated-numbers"), {
  ssr: false,
});

const RewardsInfoBox = ({
  totalTransactions,
  changeScreen,
  type,
  rewardPool,
  loading,
}: IRewardBoxProps) => {
  const { chain, setChain } = useChainContext();

  const showRewardPool = type === "black";

  const imgLink = (opt: string) => {
    switch (opt) {
      case "SOL":
        return "/assets/images/chainIcons/solanaIcon.svg";
      case "ARB":
        return "/assets/images/chainIcons/arbIcon.svg";
      case "POLY_ZK":
        return "/assets/images/chainIcons/polygonIcon.svg";
      case "ETH":
      default:
        return "/assets/images/chainIcons/ethIcon.svg";
    }
  };

  const [showModal, setShowModal] = useState(false);

  const { width } = useViewport();
  const mobileBreakpoint = 620;

  const chainOptions = Object.keys(SupportedChains).map((chain) => ({
    name: chain,
    icon: <img src={imgLink(chain)} alt={`${chain}-icon`} />,
    disabled: false,
  }));

  const [prizePool, setPrizePool] = useState<number>(0);

  useEffect(() => {
    setPrizePool(rewardPool);
  }, [loading]);

  return (
    <div
      className={`${type === "black"
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
        <div onClick={!loading ? changeScreen : () => { }}>
          {showRewardPool ? (
            <Suspense>
              {!loading ? (
                <Heading as="h1">
                  $
                  <AnimatedNumbers animateToNumber={prizePool} includeComma />
                </Heading>
              ) : (
                <LoadingDots />
              )}
            </Suspense>
          ) : (
            totalTransactions
          )}
        </div>
        <Heading as="h4" className={styles.alignCenter}>
          {!loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {showRewardPool
                ? !loading && "Reward pool"
                : "Total transactions"}
            </motion.div>
          )}
        </Heading>
        {showModal &&
          createPortal(
            <BlockchainModal
              handleModal={setShowModal}
              option={{
                name: chain,
                icon: <img src={imgLink(chain)} alt={`${chain}-selected`} />,
              }}
              className={styles.overlap}
              options={chainOptions}
              setOption={setChain}
              mobile={width <= mobileBreakpoint && width > 0}
            />,
            document.body
          )}
        {/* <LinkButton size={"medium"} type={"internal"} handleClick={() => {}}>
          FLUID STATS
        </LinkButton> */}
      </div>
    </div>
  );
};

export default RewardsInfoBox;
