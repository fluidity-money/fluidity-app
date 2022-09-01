// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useChainContext } from "../../hooks/ChainContext";
import { ContinuousCarousel, numberToMonetaryString, trimAddress, formatTo12HrDate  } from "surfing";
import styles from "./RewardsBackground.module.scss";
  
interface Reward {
  token: string,
  amount: number,
  address: string,
  date: Date,
}

const RewardsBackground = () => {
  const { apiState } = useChainContext();
  const rewards: Reward[] = apiState.weekWinnings
    .map(winning => ({
      token: winning.token_short_name,
      amount: winning.winning_amount,
      address: winning.winning_address,
      date: new Date(winning.awarded_time),
    }))

  const carouselInfo = (
    <div>
      {rewards.slice(5).map(({token, amount, address, date}, i) => (
        <div
          key={`winner-${i}`}
          className={styles.winner}
        >
          <p>
            {token}{" "}
          </p>
          <p>
            {numberToMonetaryString(amount)}{" "}
          </p>
          <p>
            {trimAddress(address)}{" "}
          </p>
          <p>
            {formatTo12HrDate(date)}
          </p>
        </div>
      ))}
    </div>
  );
  return (
    <div className={styles.container}>
      <div className={styles.shade}></div>
      <div className={styles.rewardsBackground}>
        <ContinuousCarousel direction="right">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel direction="left">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel direction="right">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel direction="left">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel direction="right">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel direction="left">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel direction="right">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel direction="left">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel direction="right">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel direction="left">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel direction="right">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel direction="left">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel direction="right">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel direction="left">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel direction="right">
          {carouselInfo}
        </ContinuousCarousel>
      </div>
    </div>
  );
};

export default RewardsBackground;
