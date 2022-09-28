// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { ReactNode } from "react";
import styles from "./ContinuousCarousel.module.scss";

interface IContinuousCarousel {
  direction: "right" | "left" | "up";
  children: ReactNode;
  background?: boolean;
}

const ContinuousCarousel = ({
  direction,
  children,
  background,
}: IContinuousCarousel) => {
  /* 
  Continuous carousel in right or left direction
  */
  return (
    <div
      className={
        direction === "right"
          ? `${styles.winnersRight} ${background && styles.backgroundRight}`
          : direction === "left"
          ? `${styles.winnersLeft} ${background && styles.backgroundLeft}`
          : `${styles.winnersTop}`
      }
    >
      <div
        className={
          direction === "right"
            ? `${styles.winnersRightLine} ${
                background && styles.backgroundRight
              }`
            : direction === "left"
            ? `${styles.winnersLeftLine} ${background && styles.backgroundLeft}`
            : `${styles.winnersTopLine}`
        }
      >
        {/* <div>
          {ContinuousCarousels.map((winner) => (
            <div
              className={styles.winner}
            >{`${winner.blockchain} DEX ${winner.amount} ${winner.id} ${winner.date}`}</div>
          ))}
        </div> */}
        {children}
      </div>
    </div>
  );
};

export default ContinuousCarousel;

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
