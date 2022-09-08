// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useChainContext } from "../../hooks/ChainContext";
import {
  ContinuousCarousel,
  numberToMonetaryString,
  trimAddress,
  formatTo12HrDate,
  Text,
} from "@fluidity-money/surfing";
import styles from "./RewardsBackground.module.scss";
import { JsxElement } from "typescript";

interface Reward {
  token: string;
  amount: number;
  address: string;
  date: Date;
}

const RewardsBackground = () => {
  const { apiState } = useChainContext();
  const rewards: Reward[] = apiState.weekWinnings.map((winning) => ({
    token: winning.token_short_name,
    amount: winning.winning_amount,
    address: winning.winning_address,
    date: new Date(winning.awarded_time),
  }));

  const carouselInfo = (
    <div>
      {rewards.slice(10).map(({ token, amount, address, date }, i) => (
        <div key={`winner-${i}`} className={styles.winner}>
          <img
            src={
              token === "USDT"
                ? "/assets/images/tokenIcons/usdt.svg"
                : "/assets/images/tokenIcons/usdc.svg"
            }
            alt="tokenIcon"
          />
          <Text as="p" className={styles.hover}>
            {numberToMonetaryString(amount)}{" "}
          </Text>
          <Text as="p" className={styles.hover}>
            {trimAddress(address)}{" "}
          </Text>
          <Text as="p" className={styles.hover}>
            {formatTo12HrDate(date)}
          </Text>
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
