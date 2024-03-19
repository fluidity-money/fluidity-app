// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

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
        {children}
      </div>
    </div>
  );
};

export default ContinuousCarousel;
