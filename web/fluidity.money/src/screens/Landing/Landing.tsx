// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import ContinuousCarousel from "components/ContinuousCarousel";
import React, { useEffect, useRef, useState } from "react";
import ManualCarousel from "../../components/ManualCarousel";
import styles from "./Landing.module.scss";
import { motion } from "framer-motion";
import IntroTile from "components/IntroTile";

const Landing = () => {
  /* 
  1. BG blurs dissolve in and start slowly moving (example)
  2. ‘Money designed to move’ ticker moves and fades in from bottom (off canvas), and immediately starts scrolling slowly on loop (right to left)
  3. Video with 3D disolves in (1000ms)
  --
  4. 3D video autoplays
  5. After a few seconds (tbc based on animation provided), page auto scrolls 
  6. ‘Money dedigned to move’ text moves and fades out (top to bottom) off bottom of screen
  --
  5. 3D video scales down slightly on scroll to sit in final position between content list.
  6. A new looping 3D video appears in place of previous (seemless) and continues subtle looping animation. 
  7. Text items fade in with new looped video, perhaps staggered with slight delay, or with lines building out from left to righ ton left, and right  to left on right.
    */

  const [fadeProp, setFadeProp] = useState("fadeIn");
  // const myRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   console.log("my ref", myRef.current);
  //   const observer = new IntersectionObserver((entries) => {
  //     const entry = entries[0];
  //     console.log("entry", entry);
  //     console.log("bcr", entry.boundingClientRect);
  //     console.log("isr", entry.intersectionRect);
  //     console.log("rb", entry.rootBounds);
  //     if (entry.boundingClientRect.top < 356) {
  //       handleClick();
  //     }
  //   });

  //   observer.observe(myRef.current as Element);
  // }, []);

  return (
    <div className={`${styles.containerLanding}`}>
      <motion.div className={styles.content}>
        <motion.h1
          initial={{ opacity: 0, y: "-100vh" }}
          animate={{ opacity: [0, 0, 0, 1], y: 0 }}
          transition={{ duration: 4, type: "tween" }}
        >
          Fluidity is the blockchain incentive layer, <br />
          rewarding people for using their crypto.
        </motion.h1>
        <div className={styles.tiles}>
          <motion.div
            initial={{ opacity: 0, y: "-100vh" }}
            animate={{ opacity: [0, 0, 0, 1], y: 0 }}
            transition={{ duration: 4, type: "tween" }}
            className={styles.left}
          >
            <IntroTile type={"star"} side={"left"}>
              1 to 1 exchange rate, <br />
              to base wrapped assets
            </IntroTile>
            <IntroTile type={"star"} side={"left"}>
              Senders and receivers <br />
              both qualify
            </IntroTile>
            <IntroTile type={"ellipse"} side={"left"}>
              Every transaction <br />
              qualifies as a reward
            </IntroTile>
          </motion.div>
          <motion.div
            className={styles.video}
            initial={{ y: -150, scale: 1 }}
            animate={{
              opacity: 1,
              y: [-150, -150, -150, 0],
              scale: [1, 1, 1, 0.8],
            }}
            transition={{ duration: 4, type: "tween" }}
          ></motion.div>
          <motion.div
            initial={{ opacity: 0, y: "-100vh" }}
            animate={{ opacity: [0, 0, 0, 1], y: 0 }}
            transition={{ duration: 4, type: "tween" }}
            className={styles.right}
          >
            <IntroTile type={"star"} side={"right"}>
              Fluidity improves your expected <br />
              outcome over time
            </IntroTile>
            <IntroTile type={"ellipse"} side={"right"}>
              Rewards can be significant
            </IntroTile>
            <IntroTile type={"ellipse"} side={"right"}>
              Scaling ecosystem
            </IntroTile>
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        className={styles.carousel}
        initial={{ opacity: 0, y: "100vh" }}
        animate={{ opacity: [1, 1, 1, 0], y: [0, 0, 0, 100] }}
        transition={{ duration: 4, type: "tween" }}
      >
        <ContinuousCarousel direction={"right"}>
          <div>
            <div className={styles.text}>MONEY DESIGNED TO MOVE</div>
            <div className={styles.text}>MONEY DESIGNED TO MOVE</div>
            <div className={styles.text}>MONEY DESIGNED TO MOVE</div>
            <div className={styles.text}>MONEY DESIGNED TO MOVE</div>
            <div className={styles.text}>MONEY DESIGNED TO MOVE</div>
            <div className={styles.text}>MONEY DESIGNED TO MOVE</div>
            <div className={styles.text}>MONEY DESIGNED TO MOVE</div>
            <div className={styles.text}>MONEY DESIGNED TO MOVE</div>
            <div className={styles.text}>MONEY DESIGNED TO MOVE</div>
            <div className={styles.text}>MONEY DESIGNED TO MOVE</div>
          </div>
        </ContinuousCarousel>
      </motion.div>
    </div>
  );
};

export default Landing;
