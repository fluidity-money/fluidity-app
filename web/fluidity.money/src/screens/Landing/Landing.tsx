// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { useState } from "react";
import {
  ContinuousCarousel,
  Heading,
  useViewport,
  IntroTile,
  Video,
} from "@fluidity-money/surfing";
import { motion } from "framer-motion";
import styles from "./Landing.module.scss";
import { isSafari, isFirefox, isIOS, isMobile } from "react-device-detect";

const Landing = () => {
  let type = isSafari || isIOS ? "video/quicktime" : "video/webm";
  let vidSources = (
    isSafari || isIOS
      ? ["/assets/videos/FluidityHomeloop.mov"]
      : ["/assets/videos/FluidityHomeloop.webm"]
  ).map((link) => link);

  const state = {
    src: vidSources[0],
    mimeType: type,
    key: "video-0",
    loop: true,
    scale: isFirefox ? 1 : 0.5,
  };

  const { width } = useViewport();
  const breakpoint = 620;

  const callout = (
    <div className={styles.callout}>
      <Heading as="h4" className={styles.text}>
        MONEY DESIGNED TO MOVE MONEY DESIGNED TO MOVE
      </Heading>
      <Heading as="h4" className={styles.text}>
        MONEY DESIGNED TO MOVE
      </Heading>
    </div>
  );

  return (
    <div className={`${styles.containerLanding}`}>
    </div>
  );
};

export default Landing;
