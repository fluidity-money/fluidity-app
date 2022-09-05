// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import type { Chain } from "hooks/ChainContext"

import { useState } from "react";
import { BlockchainModal, ChainSelectorButton, numberToMonetaryString, SupportedChains } from "surfing";
import { useChainContext, SupportedChainsList } from "hooks/ChainContext";
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

  const imgLink = (opt: string) => opt === "ETH" ? "/assets/images/chainIcons/ethIcon.svg" : "/assets/images/chainIcons/solanaIcon.svg";
  
  const [showModal, setShowModal] = useState(false);

  const options = SupportedChainsList.map(chain => ({
    name: SupportedChains[chain as Chain].short,
    icon: <img src={imgLink(chain)} alt={`${chain}-icon`} />
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
          option={{
            name: chain,
            icon: <img src={imgLink(chain)} alt="hello" />,
          }}
          setOptions={setShowModal}
          options={options}
        />
        <h1 onClick={switchAndAnimate}>
          {type === "black"
            ? numberToMonetaryString(rewardPool)
            : totalTransactionValue.toLocaleString("en-US")}
        </h1>
        <h3>{type === "black" ? "Reward pool" : "Total transactions"}</h3>
        {showModal && <BlockchainModal 
          handleModal={setShowModal}
          option={{
            name: SupportedChains[chain as Chain].short,
            icon: <img src={imgLink(chain)} alt="hello" />,
          }}
          options={options}
          setOption={setChain}
        />}
        {/* <LinkButton size={"medium"} type={"internal"} handleClick={() => {}}>
          FLUID STATS
        </LinkButton> */}
      </div>
    </div>
  );
};

export default RewardsInfoBox;
