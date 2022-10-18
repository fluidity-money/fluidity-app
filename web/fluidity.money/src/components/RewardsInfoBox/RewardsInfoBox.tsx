// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { useState } from "react";
import { useChainContext } from "hooks/ChainContext";
import useViewport from "hooks/useViewport";
import {
  LinkButton,
  BlockchainModal,
  ChainSelectorButton,
  numberToMonetaryString,
  SupportedChains,
  Heading,
} from "@fluidity-money/surfing";
import styles from "./RewardsInfoBox.module.scss";

interface IRewardBoxProps {
  rewardPool: number;
  totalTransactions: number;
  changeScreen: () => void;
  type: "black" | "transparent";
}

const RewardsInfoBox = ({
  rewardPool,
  totalTransactions,
  changeScreen,
  type,
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
              ? numberToMonetaryString(rewardPool)
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
