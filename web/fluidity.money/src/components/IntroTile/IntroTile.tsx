// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import React, { ReactNode } from "react";
import styles from "./IntroTile.module.scss";

interface IIntroTileProps {
  children: ReactNode;
  img: string;
  side: "left" | "right";
}

const IntroTile = ({ img, side, children }: IIntroTileProps) => {
  return (
    <>
      {side === "left" && (
        <div className={styles.containerLeft}>
          <img src={img} alt="" />

          <div className={`${styles.text} ${styles.left}`}>
            <p>{children}</p>
          </div>
        </div>
      )}
      {side === "right" && (
        <div className={styles.containerRight}>
          <div className={`${styles.text} ${styles.right}`}>
            <p>{children}</p>
          </div>
          <img src={img} alt="" />
        </div>
      )}
    </>
  );
};

export default IntroTile;
