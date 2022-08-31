// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { LinkButton } from "components/Button";
import FluidProject from "components/FluidProject";
import { motion, useScroll } from "framer-motion";
import ManualCarousel from "components/ManualCarousel";
import React, { useRef } from "react";
import styles from "./Ecosystem.module.scss";

const Ecosystem = () => {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });

  console.log(scrollYProgress);
  return (
    <div className={styles.container}>
      <div className={styles.textBehind}>
        <motion.h1
          // initial={{ opacity: 1 }}
          // animate={{ opacity: 0 }}
          // transition={{ scrollYProgress }}
          style={{ opacity: scrollYProgress }}
        >
          ECOSYSTEM
        </motion.h1>
      </div>

      <div className={styles.scrollable} ref={scrollRef}>
        <div className={styles.background}>
          <h1>I'm an Image/Video</h1>
        </div>
        <div className={styles.projects}>
          <div className={styles.above}>
            <h2>Fluidity Projects</h2>
            <LinkButton
              size={"medium"}
              type={"internal"}
              handleClick={() => {}}
            >
              EXPLORE THE ECOSYSTEM
            </LinkButton>
          </div>
          <ManualCarousel>
            {items.map((item) => (
              <div
                style={{
                  border: "1px solid white",
                  height: 200,
                  minWidth: 300,
                  margin: 20,
                  marginBottom: 50,
                }}
              >
                {item.item}
              </div>
            ))}
          </ManualCarousel>
        </div>
      </div>
    </div>
  );
};

export default Ecosystem;

const items = [
  { item: "🦍" },
  { item: "🦍" },
  { item: "🦍" },
  { item: "🦍" },
  { item: "🦍" },
  { item: "🦍" },
  { item: "🦍" },
];

const projects = [
  {
    title: "🦍",
    categories: [
      "anyCat",
      "defi",
      "dex",
      "nft",
      "gaming",
      "payments",
      "metaverse",
      "dao",
    ],
    chains: ["anyChain", "ethereum"],
    years: ["anyYear", "2022"],
    topPrize: 20000,
  },
  {
    title: "🦍",
    categories: [
      "anyCat",
      "defi",
      "dex",
      "nft",
      "gaming",
      "payments",
      "metaverse",
      "dao",
    ],
    chains: ["anyChain", "ethereum"],
    years: ["anyYear", "2022"],
    topPrize: 10000,
  },
  {
    title: "🦍",
    categories: ["anyCat", "defi", "dex", "payments", "metaverse", "dao"],
    chains: ["anyChain", "ethereum"],
    years: ["anyYear", "2022"],
    topPrize: 5000,
  },
  {
    title: "🦍",
    categories: ["anyCat", "gaming", "payments", "metaverse", "dao"],
    chains: ["anyChain", "ethereum"],
    years: ["anyYear", "2022"],
    topPrize: 2000,
  },
  {
    title: "🦍",
    categories: ["anyCat", "defi", "dex", "nft", "gaming", "dao"],
    chains: ["anyChain", "ethereum"],
    years: ["anyYear", "2022"],
    topPrize: 14000,
  },
  {
    title: "🦍",
    categories: [
      "anyCat",
      "defi",
      "dex",
      "nft",
      "payments",
      "metaverse",
      "dao",
    ],
    chains: ["anyChain", "ethereum"],
    years: ["anyYear", "2022"],
    topPrize: 12000,
  },
  {
    title: "🦍",
    categories: ["anyCat", "defi", "dex", "nft", "gaming", "payments"],
    chains: ["anyChain", "ethereum"],
    years: ["anyYear", "2022"],
    topPrize: 18000,
  },
  {
    title: "🦍",
    categories: ["anyCat", "dex", "nft", "payments", "dao"],
    chains: ["anyChain", "ethereum"],
    years: ["anyYear", "2022"],
    topPrize: 800,
  },
];
