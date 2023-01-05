// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { ReactNode } from "react";
import styles from "./ContinuousCarousel.module.scss";

interface IContinuousCarousel {
  direction: "right" | "left" | "up";
  children: ReactNode;
}

const ContinuousCarousel = ({ direction, children }: IContinuousCarousel) => {
  /* 
  Continuous carousel in right or left direction
  */
  return (
    <div
      className={
        direction === "right"
          ? `${styles.winnersRight}`
          : direction === "left"
          ? `${styles.winnersLeft}`
          : `${styles.winnersTop}`
      }
    >
      <div
        className={
          direction === "right"
            ? `${styles.winnersRightLine}`
            : direction === "left"
            ? `${styles.winnersLeftLine}`
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

