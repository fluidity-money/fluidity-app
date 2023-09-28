// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { useState } from "react";
import {
  useViewport,
  Text,
  Card,
  Display,
  GeneralButton,
  LinkButton,
  Video,
  ArrowTopRight
} from "@fluidity-money/surfing";
import { motion } from "framer-motion";
import styles from "./Landing.module.scss";
import { isSafari, isFirefox, isIOS, isMobile } from "react-device-detect";

import Image from "next/image";

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

  const [hovered, setHovered] = useState(null);

  return (
    <div className={`${styles.containerLanding}`}>
      <Video
        loop
        src="/assets/videos/BubbleFloat.mp4"
        type="cover"
        className={styles.video}
      />
      <Card
        onMouseEnter={() => { setHovered(true) }}
        onMouseLeave={() => { setHovered(false) }}
        color={hovered ? 'holo' : 'gray'}
        type="frosted"
        border="solid"
        className={styles.announcement}
        onClick={() => {
          window.open('https://superposition.so', '_blank')
        }}
      >
        <Image width={16} height={16} src="/assets/images/spn.png" />
        <Text size="xs">Announcing Superposition: Fluidity's Layer-3 Evolution</Text>

        <motion.div
          animate={{
            opacity: hovered ? 1 : 0,
            width: hovered ? 'auto' : 0,
            marginLeft: hovered ? '0' : '-1em'
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <ArrowTopRight />
        </motion.div>
      </Card>
      <Display size="lg" className={styles.display}>
        Fluidity is<br />
        <span style={{ textAlign: 'right', display: 'block', width: '100%' }}>the Block<i>chain</i> <br /></span>
        <b>In<i>cent</i>ive Layer</b>
      </Display>
      <div className={styles.heroBar}>
        <div className={styles.heroDesc}>
          <Text size="md">
            Transform your USDC into Fluid USDC,<br />
            perform any on-chain transaction, and&nbsp;
          </Text>
          <Text
            size="md"
            prominent
            style={{
              textDecoration: 'underline',
              textUnderlineOffset: '0.5em',
              whiteSpace: 'nowrap'
            }}
          >
            earn rewards for using your crypto.
          </Text>
        </div>
        <div className={styles.heroButtons}>
          <GeneralButton
            type="secondary"
            style={{ padding: '1em 3.5em' }}
            className={styles.rainbow}
            handleClick={() => {
              window.open('https://app.fluidity.money/arbitrum/fluidify', '_blank')
            }}
          >
            <Text code prominent size="md">FLUIDIFY MONEY</Text>
          </GeneralButton>
          <LinkButton size="small" type="external" handleClick={() => {
            window.open('https://discord.gg/fluidity', '_blank')
          }}>
            JOIN DISCORD
          </LinkButton>
        </div>
      </div>
    </div>
  );
};

export default Landing;
