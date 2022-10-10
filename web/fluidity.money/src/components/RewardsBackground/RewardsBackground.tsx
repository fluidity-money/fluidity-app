// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { useChainContext } from "hooks/ChainContext";
import {
  ContinuousCarousel,
  numberToMonetaryString,
  trimAddressShort,
  formatTo12HrDate,
  Text,
} from "@fluidity-money/surfing";
import styles from "./RewardsBackground.module.scss";

interface Reward {
  token: string;
  amount: number;
  address: string;
  date: Date;
  transaction: string;
}

const RewardsBackground = () => {
  const { apiState } = useChainContext();
  const { weekWinnings } = apiState;

  const rewards: Reward[] = weekWinnings.map((winning) => ({
    token: winning.token_short_name,
    amount: winning.winning_amount,
    address: winning.winning_address,
    date: new Date(winning.awarded_time),
    transaction: winning.transaction_hash,
  }));

  const carouselInfo = (
    <div>
      {rewards
        .slice(10)
        .map(({ token, amount, address, date, transaction }, i) => (
          <div key={`winner-${i}`} className={styles.winner}>
            <a
              href={`https://etherscan.io/tx/${transaction}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={
                  token === "USDT"
                    ? "/assets/images/tokenIcons/usdt.svg"
                    : "/assets/images/tokenIcons/usdc.svg"
                }
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
        ))}
    </div>
  );
  return (
    <div className={styles.container}>
      <div className={styles.shade}></div>
      <div className={styles.rewardsBackground}>
        <ContinuousCarousel background={true} direction="right">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel background={true} direction="left">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel background={true} direction="right">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel background={true} direction="left">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel background={true} direction="right">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel background={true} direction="left">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel background={true} direction="right">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel background={true} direction="left">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel background={true} direction="right">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel background={true} direction="left">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel background={true} direction="right">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel background={true} direction="left">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel background={true} direction="right">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel background={true} direction="left">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel background={true} direction="right">
          {carouselInfo}
        </ContinuousCarousel>
      </div>
    </div>
  );
};

export default RewardsBackground;
