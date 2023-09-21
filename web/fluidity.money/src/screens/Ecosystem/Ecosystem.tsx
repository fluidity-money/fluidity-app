// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { useRef, useState } from "react";
import { ManualCarousel, Text, LinkButton, Display, BloomEffect, ContinuousCarousel, ArrowTopRight } from "@fluidity-money/surfing";
import { motion, useScroll } from "framer-motion";
import styles from "./Ecosystem.module.scss";
import Image from 'next/image'

type Protocol = {
  name: string;
  src: string;
  href: string;
  width: number,
  height: number
}

const protocolList = [
  {
    name: "Gains Network",
    src: "/assets/images/protocols/gains.svg",
    href: "https://gainsnetwork.io",
    width: 113,
    height: 17
  },
  {
    name: "Factor DAO",
    src: "/assets/images/protocols/factor.svg",
    href: "https://factor.fi",
    width: 80,
    height: 26
  },
  {
    name: "Rodeo Finance",
    src: "/assets/images/protocols/rodeo.svg",
    href: "https://rodeofinance.xyz",
    width: 113,
    height: 20,
  },
  {
    name: "Chronos",
    src: "/assets/images/protocols/chronos.svg",
    href: "https://chronos.exchange",
    width: 117,
    height: 24
  },
  {
    name: "Vesta Finance",
    src: "/assets/images/protocols/vesta.svg",
    href: "https://vestafinance.xyz",
    width: 124,
    height: 22,
  },
  {
    name: "Wombat",
    src: "/assets/images/protocols/wombat.svg",
    href: "https://wombat.exchange",
    width: 94,
    height: 38
  },
  {
    name: "dappOS",
    src: "/assets/images/protocols/dappos.svg",
    href: "https://dappos.com",
    width: 84,
    height: 29
  },
  {
    name: "KyberSwap",
    src: "/assets/images/protocols/kyber.svg",
    href: "https://kyberswap.com",
    width: 86,
    height: 24
  },
  {
    name: "Mises Browser",
    src: "/assets/images/protocols/mises.svg",
    href: "https://mises.site",
    width: 114,
    height: 19,
  },
  {
    name: "Meson",
    src: "/assets/images/protocols/meson.svg",
    href: "https://meson.fi",
    width: 79,
    height: 11
  },
  {
    name: "Arbswap",
    src: "/assets/images/protocols/arbswap.svg",
    href: "https://arbswap.io",
    width: 80,
    height: 24
  },
  {
    name: "CrescentSwap",
    src: "/assets/images/protocols/crescentswap.svg",
    href: "https://crescentswap.exchange",
    width: 32,
    height: 36
  }
]


const Ecosystem = () => {

  return (
    <div className={styles.ecosystem}>
      <BloomEffect width={30} type={"static"} className={styles.bloom} />
      <Display>
        <b><Text bold holo style={{ fontFamily: 'inherit', fontSize: 'inherit' }}>31,423+</Text> REWARDS</b>
      </Display>
      <Text size="md" style={{ marginBottom: 50 }}>
        Distributed over 15+ Integrated Protocols
      </Text>
      <BetterCarousel direction="left">
        {
          protocolList.map((p, i) => {
            return <Protocol protocol={p} key={`right-${p.name}-${i}`} />
          })
        }
      </BetterCarousel>
      <BetterCarousel direction="right">
        {
          protocolList.reverse().map((p, i) => {
            return <Protocol protocol={p} key={`right-${p.name}-${i}`} />
          })
        }
      </BetterCarousel>
    </div>
  );
};

const Protocol = (props: { protocol: Protocol }) => {
  const { protocol } = props;
  const [hovered, setHovered] = useState(false)
  return <motion.div
    className={styles.protocol}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    onClick={() => window.open(protocol.href, "_blank")}
  >
    <Image
      src={protocol.src}
      width={protocol.width}
      height={protocol.height}
    />
    <motion.div
      className={styles.external}
      animate={{
        opacity: hovered ? 1 : 0,
        width: hovered ? 'auto' : 0,
        marginLeft: hovered ? '0.4em' : 0
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <ArrowTopRight />
    </motion.div>
  </motion.div>
}

const BetterCarousel = (props: { children: React.ReactNode[], direction?: "left" | "right" }) => {
  const { children, direction } = props
  return <div
    className={styles.carousel}
  >
    <motion.div
      className={`${styles.row} ${direction === "left" ? styles.left : styles.right}`}
    >
      {children}
      {children}
    </motion.div>
  </div >
}

export default Ecosystem;
