// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import {
  Text,
  Display,
  ArrowLeft,
  ArrowRight
} from "@fluidity-money/surfing";
import styles from "./SponsorsPartners.module.scss";
import Image from 'next/image'
import { motion } from "framer-motion";
import { useState } from "react";

type Sponsor = {
  img: string;
  url: string;
  title: string;
  width: number;
  height: number;
};

const majorPartners = [
  {
    img: "/assets/images/partners/CIRCLE.svg",
    url: "https://www.circle.com/en/",
    title: "Circle",
    width: 133,
    height: 34
  },
  {
    img: "/assets/images/partners/multicoin.svg",
    url: "https://multicoin.capital",
    title: "Multicoin Capital",
    width: 257,
    height: 35
  },
]

const partners = [
  {
    img: "/assets/images/partners/SOLANA.svg",
    url: "https://solana.ventures",
    title: "Solana Ventures",
    width: 143,
    height: 27
  },
  {
    img: "/assets/images/partners/LEMNISCAP.svg",
    url: "https://lemniscap.com",
    title: "Lemniscap",
    width: 141,
    height: 28
  },
  {
    title: "NGC Ventures",
    url: "https://ngc.fund/",
    img: "/assets/images/partners/NGC.svg",
    width: 185,
    height: 20
  },
  {
    title: "SkyVision Capital",
    url: "https://www.skyvisioncapital.com/",
    img: "/assets/images/partners/SVC.svg",
    width: 108,
    height: 38
  },
  {
    title: "Bitscale Capital",
    url: "https://bitscale.vc/",
    img: "/assets/images/partners/BITSCALE.svg",
    width: 120,
    height: 46

  },
  {
    title: "Koji",
    img: "/assets/images/partners/KOJI.svg",
    url: "https://koji.capital/",
    width: 105,
    height: 38
  },
  {
    title: "Meld Ventures",
    url: "https://meld.ventures/",
    img: "/assets/images/partners/MELD.png",
    width: 180,
    height: 47
  },
  {
    title: "Mapleblock",
    url: "https://mapleblock.capital/",
    img: "/assets/images/partners/MAPLE.svg",
    width: 178,
    height: 31
  },
  {
    title: "Zonff Partners",
    url: "https://www.zonff.partners/",
    img: "/assets/images/partners/ZONFF.svg",
    width: 128,
    height: 40
  },
  {
    title: "Aave Grants DAO",
    url: "https://aavegrants.org/",
    img: "/assets/images/partners/AAVE_GRANTS.svg",
    width: 245,
    height: 161
  },
  {
    title: "Compound Grants Program",
    url: "https://twitter.com/compoundgrants?lang=en",
    img: "/assets/images/partners/COMPOUND_GRANTS.svg",
    width: 348,
    height: 83
  }
];

const SponsorsPartners = () => {
  const [offset, setOffset] = useState(0);
  const length = partners.length

  const increment = () => {
    if (offset < length - 1) {
      setOffset(offset + 1)
    } else {
      setOffset(0)
    }
  }

  const decrement = () => {
    if (offset > 0) {
      setOffset(offset - 1)
    } else {
      setOffset(length - 1)
    }
  }

  const r2partners = [...partners, ...partners]

  return (
    <div className={`${styles.container}`}>
      <div className={styles.heading}>
        <Text size="md">Fluidity has been</Text>
        <Display size="md">
          <b>TRUSTED &<br />
            SUPPORTED BY</b>
        </Display>
      </div>
      <div className={styles.r1}>

        {
          majorPartners.map((partner, i) => <Sponsor size="lg" key={i} sponsor={partner} />)
        }
      </div>
      <motion.div className={styles.r2}>
        <motion.div
          className={styles.inner}
          animate={{
            x: offset * 220 * -1 - 110
          }}
        >
          {
            r2partners.map((partner, i) => <Sponsor size="sm" key={i} sponsor={partner} />)
          }
        </motion.div>
      </motion.div>
      <div className={styles.nav}>
        <div className={styles.navBtn} onClick={() => decrement()}><ArrowLeft /></div>
        <div className={styles.navBtn} onClick={() => increment()}><ArrowRight /></div>
      </div>
    </div>
  );
};

const Sponsor = (props: { sponsor: Sponsor, size: "sm" | "lg" }) => {
  const { sponsor, size } = props
  return (
    <div
      className={`${styles.sponsor} ${styles[size]}`}
      onClick={
        () => {
          window.open(sponsor.url, "_blank")
        }
      }
    >
      <div className={styles.inner}>
        <Image
          layout="fill"
          src={sponsor.img}
        />
      </div>
    </div>
  )
}

export default SponsorsPartners;
