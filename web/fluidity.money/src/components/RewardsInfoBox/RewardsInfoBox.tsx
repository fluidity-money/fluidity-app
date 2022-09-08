// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useState } from "react";
import { useChainContext } from "hooks/ChainContext";
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
  totalTransactionValue: number;
  setToggle: () => void;
  toggle: boolean;
  initalView: boolean;
  switchAndAnimate: () => void;
  type: "black" | "transparent";
}

const RewardsInfoBox = ({
  rewardPool,
  totalTransactionValue,
  initalView,
  switchAndAnimate,
  type,
}: IRewardBoxProps) => {
  const { chain, setChain } = useChainContext();

  const imgLink = (opt: string) =>
    opt === "ETH"
      ? "/assets/images/chainIcons/ethIcon.svg"
      : "/assets/images/chainIcons/solanaIcon.svg";

  const [showModal, setShowModal] = useState(false);

  const options = Object.keys(SupportedChains).map((chain) => ({
    name: chain,
    icon: <img src={imgLink(chain)} alt={`${chain}-icon`} />,
  }));

  return (
    <div
      className={
        initalView
          ? `${styles.infoBoxContainer} ${
              type === "black" ? styles.fadeIn : styles.fadeOut
            }`
          : `${styles.infoBoxContainer} ${
              type === "black" ? styles.fadeOut : styles.fadeIn
            }`
      }
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
        <div onClick={switchAndAnimate}>
          <Heading as="h1">
            {type === "black"
              ? numberToMonetaryString(rewardPool)
              : totalTransactionValue.toLocaleString("en-US")}
          </Heading>
        </div>
        <Heading as="h4">
          {type === "black" ? "Reward pool" : "Total transactions"}
        </Heading>
        {showModal && (
          <BlockchainModal
            handleModal={setShowModal}
            option={{
              name: chain,
              icon: <img src={imgLink(chain)} alt={`${chain}-selected`} />,
            }}
            options={options}
            setOption={setChain}
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
