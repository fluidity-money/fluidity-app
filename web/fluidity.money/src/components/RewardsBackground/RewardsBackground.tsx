// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import React from "react";
import ContinuousCarousel from "../ContinuousCarousel";
import styles from "./RewardsBackground.module.scss";

const RewardsBackground = () => {
  const carouselInfo = (
    <div>
      {ContinuousCarousels.map((winner) => (
        <div
          className={styles.winner}
        >{`${winner.blockchain} DEX ${winner.amount} ${winner.id} ${winner.date}`}</div>
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
        <ContinuousCarousel direction="left">{carouselInfo}</ContinuousCarousel>
        <ContinuousCarousel direction="right">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel direction="left">{carouselInfo}</ContinuousCarousel>
        <ContinuousCarousel direction="right">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel direction="left">{carouselInfo}</ContinuousCarousel>
        <ContinuousCarousel direction="right">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel direction="left">{carouselInfo}</ContinuousCarousel>
        <ContinuousCarousel direction="right">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel direction="left">{carouselInfo}</ContinuousCarousel>
        <ContinuousCarousel direction="right">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel direction="left">{carouselInfo}</ContinuousCarousel>
        <ContinuousCarousel direction="right">
          {carouselInfo}
        </ContinuousCarousel>
        <ContinuousCarousel direction="left">{carouselInfo}</ContinuousCarousel>
        <ContinuousCarousel direction="right">
          {carouselInfo}
        </ContinuousCarousel>
      </div>
    </div>
  );
};

export default RewardsBackground;

const ContinuousCarousels = [
  {
    blockchain: "🦍",
    amount: "1.01",
    id: "9ozY5b..saDwFf",
    date: "21.06.22 11:54am",
  },
  {
    blockchain: "🦍",
    amount: "1.01",
    id: "9ozY5b..saDwFf",
    date: "21.06.22 11:54am",
  },
  {
    blockchain: "🦍",
    amount: "1.01",
    id: "9ozY5b..saDwFf",
    date: "21.06.22 11:54am",
  },
  {
    blockchain: "🦍",
    amount: "1.01",
    id: "9ozY5b..saDwFf",
    date: "21.06.22 11:54am",
  },
  {
    blockchain: "🦍",
    amount: "1.01",
    id: "9ozY5b..saDwFf",
    date: "21.06.22 11:54am",
  },
  {
    blockchain: "🦍",
    amount: "1.01",
    id: "9ozY5b..saDwFf",
    date: "21.06.22 11:54am",
  },
  {
    blockchain: "🦍",
    amount: "1.01",
    id: "9ozY5b..saDwFf",
    date: "21.06.22 11:54am",
  },
  {
    blockchain: "🦍",
    amount: "1.01",
    id: "9ozY5b..saDwFf",
    date: "21.06.22 11:54am",
  },
  {
    blockchain: "🦍",
    amount: "1.01",
    id: "9ozY5b..saDwFf",
    date: "21.06.22 11:54am",
  },
  {
    blockchain: "🦍",
    amount: "1.01",
    id: "9ozY5b..saDwFf",
    date: "21.06.22 11:54am",
  },
];
