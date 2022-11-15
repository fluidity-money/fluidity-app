// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { Heading } from "@fluidity-money/surfing";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import styles from "./IntroTile.module.scss";

interface IIntroTileProps {
  children: ReactNode;
  img: string;
  side: "left" | "right";
}

const IntroTile = ({ img, side, children }: IIntroTileProps) => {
  const bounceTransition = {
    y: {
      duration: Math.floor(Math.random() * (21 - 1) + 1) >= 10 ? 2 : 1.5,
      yoyo: Infinity,
      ease: "easeOut"
    },
  };
  return (
    <>
      {side === "left" && (
        <div className={styles.containerLeft}>
          <motion.div
            transition={bounceTransition}
            animate={{
              y: ["0px", "13px"]
            }}
          >
            <img src={img} alt="Intro-Title-Left" />
          </motion.div>
          <div className={`${styles.text} ${styles.left}`}>
            <Heading as="h6">{children}</Heading>
          </div>
        </div>
      )}
      {side === "right" && (
        <div className={styles.containerRight}>
          <div className={`${styles.text} ${styles.right}`}>
            <Heading as="h6">{children}</Heading>
          </div>
          <motion.div
            transition={bounceTransition}
            animate={{
              y: ["0px", "13px"]
            }}
          >
            <img src={img} alt="Intro-Title-Right" />
          </motion.div>
        </div>
      )}
    </>
  );
};

export default IntroTile;
