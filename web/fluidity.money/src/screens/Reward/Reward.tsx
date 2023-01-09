// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import {formatTo12HrDate, numberToMonetaryString, Text, trimAddressShort} from "@fluidity-money/surfing";
import {useChainContext} from "hooks/ChainContext";
import { useMemo, useState } from "react";
import RewardsInitial from "screens/RewardsInitial";
import RewardStats from "screens/RewardsStats";
import styles from "./Reward.module.scss";


interface IReward {
  token: string;
  amount: number;
  address: string;
  date: Date;
  transaction: string;
}

const Reward = () => {
  /* Background of transactions info moving left and right cotinuously,
  Reward pool total with sol and eth toggle,
  click on prize total and switch screens to total transactions sol and eth,
  elements fade in and out then are conditionally removed
  */
  //sets which screen is present
  const [present, setPresent] = useState(true);

  // context for rewards background
  const { apiState, chain, network } = useChainContext();
  const { weekWinnings } = apiState;

  // memoise rewards to be shown in rewards background
  // to avoid reloading every time the background is toggled

  const rewards: IReward[] = useMemo(() => weekWinnings.map((winning) => ({
    token: winning.token_short_name,
    amount: winning.winning_amount / 10 ** winning.token_decimals,
    address: winning.winning_address,
    date: new Date(winning.awarded_time),
    transaction: winning.transaction_hash,
  })), [weekWinnings]);

  const txExplorerUrl = (txHash: string) => {
    switch (true) {
      case chain === "ETH" && network === "STAGING":
        return `https://ropsten.etherscan.io/tx/${txHash}`;
      case chain === "ETH" && network === "MAINNET":
        return `https://etherscan.io/tx/${txHash}`;
      case chain === "SOL" && network === "STAGING":
        return `https://explorer.solana.com/tx/${txHash}?cluster=devnet`;
      case chain === "SOL" && network === "MAINNET":
        return `https://explorer.solana.com/tx/${txHash}`;
    }
  };

  // memoise carousel entries generated from rewards
  const CarouselInfo = useMemo(() => (
    rewards.map(({token, amount, address, date, transaction}, i) => (
      <div key={`winner-${i}`} className={styles.winner}>
        <a
          href={txExplorerUrl(transaction)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={"/assets/images/tokenIcons/f" + token + ".png"}
            alt="tokenIcon"
          />

          <Text as="p" prominent={true} className={styles.hover}>
            {numberToMonetaryString(amount)}{" "}
          </Text>

          <Text as="p" className={styles.hover}>
            {`sent to`}{" "}
          </Text>

          <Text as="p" className={styles.hoverUnderline}>
            {`${trimAddressShort(address)}`}{" "}
          </Text>

          <Text as="p" className={styles.hover}>
            {formatTo12HrDate(date)}
          </Text>
        </a>
      </div>
    ))
  ), [rewards]);

  return (
    <>
      <div className={styles.container}>
        {present ? (
          <RewardsInitial carouselInfo={CarouselInfo} changeScreen={() => setPresent(!present)} />
        ) : (
          <RewardStats changeScreen={() => setPresent(!present)} />
        )}
      </div>
    </>
  );
};

export default Reward;
