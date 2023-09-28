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
  },
  {
    name: "Camelot",
    src: "/assets/images/protocols/camelot.svg",
    href: "https://camelot.exchange/",
    width: 83,
    height: 20
  },
  {
    name: "Dodo",
    src: "/assets/images/protocols/dodo.svg",
    href: "https://dodoex.io/en",
    width: 81,
    height: 19
  },
  {
    name: "Compound",
    src: "/assets/images/protocols/compound.svg",
    href: "https://compound.finance/",
    width: 80,
    height: 17
  },
  {
    name: "Aave",
    src: "/assets/images/protocols/aave.svg",
    href: "https://aave.com/",
    width: 81,
    height: 17
  },
  {
    name: "Solend",
    src: "/assets/images/protocols/solend.svg",
    href: "https://solend.fi/",
    width: 77,
    height: 40
  },
  {
    name: "Jupiter",
    src: "/assets/images/protocols/jupiter.svg",
    href: "https://jup.ag/",
    width: 64,
    height: 21
  },
  {
    name: "Sushi",
    src: "/assets/images/protocols/sushi.svg",
    href: "https://www.sushi.com/",
    width: 123,
    height: 45
  },
  {
    name: "Orca",
    src: "/assets/images/protocols/orca.svg",
    href: "https://www.orca.so/",
    width: 75,
    height: 20
  },
  {
    name: "Uniswap",
    src: "/assets/images/protocols/uniswap.svg",
    href: "https://uniswap.org/",
    width: 110,
    height: 23
  },
  {
    name: "OKX",
    src: "/assets/images/protocols/okx.svg",
    href: "https://www.okx.com/",
    width: 55,
    height: 16
  },
  {
    name: "Saber",
    src: "/assets/images/protocols/saber.svg",
    href: "https://app.saber.so/swap",
    width: 82,
    height: 18
  },
  {
    name: "Coin98",
    src: "/assets/images/protocols/coin98.svg",
    href: "https://coin98.com/",
    width: 85,
    height: 22
  },
  {
    name: "The Halls of Olympia",
    src: "/assets/images/protocols/olympia.svg",
    href: "https://hallsofolympia.io/",
    width: 97,
    height: 54
  },
]


const Ecosystem = () => {
  const length = protocolList.length
  const row1 = protocolList.slice(0, length / 2)
  const row2 = protocolList.slice(8, length)

  return (
    <div className={styles.ecosystem}>
      <BloomEffect width={20} type={"static"} className={styles.bloom} />
      <Display>
        <b><Text bold holo style={{ fontFamily: 'inherit', fontSize: 'inherit' }}>37,164+</Text> REWARDS</b>
      </Display>
      <Text size="md" style={{ marginBottom: 50 }}>
        Distributed over 25+ Integrated Protocols
      </Text>
      <BetterCarousel direction="left">
        {
          row1.map((p, i) => {
            return <Protocol protocol={p} key={`right-${p.name}-${i}`} />
          })
        }
      </BetterCarousel>
      <BetterCarousel direction="right">
        {
          row2.map((p, i) => {
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
