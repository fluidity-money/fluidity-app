// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { ContinuousCarousel, useViewport } from "@fluidity-money/surfing";
import styles from "./RewardsBackground.module.scss";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

interface IProps {
  carouselInfo: React.ReactNode[];
}

const RewardsBackground = ({ carouselInfo }: IProps) => {
  const { ref, inView } = useInView();
  const { width } = useViewport();

  // indexes to divide carousel rows
  const sliceIndex = [
    0, 29, 30, 59, 60, 89, 90, 119, 120, 149, 150, 179, 180, 209, 210, 239, 240,
    269, 270, 299, 300, 329, 330, 359,
  ];

  const carouselVariants = {
    appear: { x: 0 },
  };

  return (
    <div className={styles.container}>
      <div className={styles.shade}></div>
      <div className={styles.rewardsBackground} ref={ref}>
        {/* use a closure to count iterations with an accumulator */}
        {Array.from({ length: 6 }).map(
          ((iteratorCounter) => () => {
            if (sliceIndex[iteratorCounter] >= carouselInfo.length)
              iteratorCounter = 0;

            return (
              <>
                <motion.div
                  initial={
                    width < 500 && width > 0 ? { x: -500 } : { x: -1500 }
                  }
                  variants={carouselVariants}
                  animate={inView && "appear"}
                  transition={{ type: "tween", duration: 5 }}
                >
                  <ContinuousCarousel background={true} direction="right">
                    {carouselInfo.slice(
                      sliceIndex[iteratorCounter++],
                      sliceIndex[iteratorCounter++]
                    )}
                  </ContinuousCarousel>
                </motion.div>
                <motion.div
                  initial={width < 500 && width > 0 ? { x: 500 } : { x: 1500 }}
                  variants={carouselVariants}
                  animate={inView && "appear"}
                  transition={{ type: "tween", duration: 5 }}
                >
                  <ContinuousCarousel background={true} direction="left">
                    {carouselInfo.slice(
                      sliceIndex[iteratorCounter++],
                      sliceIndex[iteratorCounter++]
                    )}
                  </ContinuousCarousel>
                </motion.div>
              </>
            );
          })(0)
        )}
      </div>
    </div>
  );
};

export default RewardsBackground;
