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

  const [prizePool, setPrizePool] = useState<number>(
    Number(rewardPool.toFixed(3))
  );
  const lookupTableValue = [134290.503, 403681.583, 930205.987];
  let Count = 0;

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setPrizePool((prizePool) => {
        Count++;
        if (Count > 2) Count = 0;
        return Number(lookupTableValue[Count]);
      });
    }, 400);

    return () => clearInterval(interval);
  }, [loading]);

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
        <div onClick={!loading ? changeScreen : () => {}}>
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
