// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  ContinuousCarousel,
  Heading,
  ManualCarousel,
  Text,
} from "@fluidity-money/surfing";
import styles from "./Fluniversity.module.scss";

const Fluniversity = () => {

  const callout = (
    <div className={styles.callout}>
      <Heading hollow={true} as="h4" className={styles.text}>
        FLUNIVERSITY FLUNIVERSITY
      </Heading>
      <Heading as="h4" className={styles.text}>
        FLUNIVERSITY
      </Heading>
    </div>
  );

  return (
    <div id="fluniversity">
      <div className={styles.carousel}>
        <ContinuousCarousel direction={"right"}>
          <div>
            {callout}
            {callout}
            {callout}
            {callout}
            {callout}
            {callout}
            {callout}
            {callout}
            {callout}
            {callout}
            {callout}
          </div>
        </ContinuousCarousel>
      </div>
      <div className={styles.container}>
        <ManualCarousel>
          {items.map((item, index) => (
            <a href={item.link} rel="noopener noreferrer" target="_blank">
              <div key={index} className={styles.fluniversityCard}>
                <div className={styles.imgContainer}>

                  <img src={item.img} alt="Link"/>

                </div>

                <Heading as="h4">{item.title}</Heading>
                <Text as="p">{item.desc}</Text>
                <div className={styles.footer}>
                  <Text>{item.time} mins read</Text>
                  <Text>
                    <a
                      href={item.link}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      FLUNIVERSITY <i>*</i>
                    </a>
                  </Text>
                </div>
              </div>
            </a>
          ))}
        </ManualCarousel>
      </div>
    </div>
  );
};

export default Fluniversity;

const items = [
  {
    img: "https://miro.medium.com/max/1400/1*lyOtA25-N4ldnJKK4J4tKA.png",
    title: "With Fluidity, supercharge your arbitrage trades",
    desc: `Crypto assets worth billions of dollars are traded every single day. Arbitrage traders take advantage of the volatility and pricing imperfections, exploiting different values for the same asset across different markets. Take...`,
    time: "9 min",
    link: "https://blog.fluidity.money/with-fluidity-supercharge-your-arbitrage-trades-f0b956622e9e",
  },
  {
    img: "https://miro.medium.com/max/1400/1*7uZ8XyqeoyK3zuc-CfrFqA@2x.png",
    title: "The Hunting of the zk-SNARK: Homomorphic Hidings",
    desc: `“But the Judge said he never had summed up before; So the Snark undertook it instead, And summed it so well that it came to far more Than the Witnesses ever had said!” Lewis Carroll Zero-knowledge succinct non...`,

    time: "5 min",
    link: "https://blog.fluidity.money/the-hunting-of-the-zk-snark-homomorphic-hidings-aa6c7824597",
  },
  {
    img: "https://miro.medium.com/max/1400/1*EmAUPSMm06Ygi8Y0qA1aWg@2x.jpeg",
    title: "An alternative solution to Uniswap’s “fee switch” problem",
    desc: `In the past few months, there has been a lot of discussion in the Uniswap Governance Forum about activating the “fee switch”, a piece of code that...`,

    time: "6 min",
    link: "https://blog.fluidity.money/an-alternative-solution-to-uniswaps-fee-switch-problem-61a5e4f6057c",
  },
  {
    img: "https://miro.medium.com/max/1400/1*k_qAHb8Z289awoj87o63WQ@2x.png",
    title:
      "Tiki Talk Minutes: Fluidity x DOPEX x Arbitrum and the evolving boundaries of DeFi",
    desc: `The year 2020 marked the explosion of DeFi protocols in public imagination, driven largely by the rise of liquidity mining — Compound...`,

    time: "5 min",
    link: "https://blog.fluidity.money/tiki-talk-minutes-fluidity-x-dopex-x-arbitrum-and-the-evolving-boundaries-of-defi-ea7f1110f741",
  },
  {
    img: "https://miro.medium.com/max/1400/1*OLKC40Guu6cvD2eLhnmx1A.png",
    title: "Ghost in the machine: Fluidity Partners with AAVE Grants DAO",
    desc: `“2022 has been a wild year for Decentralized Finance. Novel concepts were introduced and big scandals were reported, but most importantly, DeFi has...`,

    time: "5 min",
    link: "https://blog.fluidity.money/ghost-in-the-machine-fluidity-partners-with-aave-a217e65ab72b",
  },
  {
    img: "https://miro.medium.com/max/1400/0*Sm_lYbSr1-P1ZB1H",
    title: "Fluidity 🌊💸— Using Chainlink VRF to power the future of money",
    desc: `Providing Users With a Secure Source of Verifiable Randomness Fluidity — Next-Generation Assets If your money’s on the move, exposure to DeFi can...`,

    time: "4 min",
    link: "https://blog.fluidity.money/fluidity-using-chainlink-vrf-to-power-the-future-of-money-11882c51ae89",
  },
  {
    img: "https://miro.medium.com/max/1400/1*Lz_6rSLepqnrLMy-YMNy7Q.jpeg",
    title: "Fluidity x MakerDAO Tiki Talk: Rethinking the stablecoin paradigm",
    desc: `A month into the UST crash, Ethereum co-founder Vitalik Buterin shared a thought experiment on a question that was on everybody’s lips. How could...`,

    time: "6 min",
    link: "https://blog.fluidity.money/fluidity-x-makerdao-tiki-talk-rethinking-the-stablecoin-paradigm-afed6912d0f6",
  },
  {
    img: "https://miro.medium.com/max/1400/1*KrCVWFOKEEmcR_y80uL1AA.jpeg",
    title:
      "Primer on Stablecoins & Lessons from UST collapse: Stablecoins need utility",
    desc: `On May 9, the Terra USD (UST) stablecoin in the Terra ecosystem showed the first signs of “depegging”. The value of UST is algorithmically secured to...`,

    time: "11 min",
    link: "https://blog.fluidity.money/primer-on-stablecoins-lessons-from-ust-collapse-stablecoins-need-utility-75bde4dca57f",
  },
  {
    img: "https://miro.medium.com/max/700/1*HJbEUecOrcNxPDBK4vHZSQ.jpeg",
    title: "Governance and Fluidity Wars: Steering the Invisible Hand",
    desc: `In our previous educational posts, we have outlined the basic economics of a Fluid Asset, from preventing cyclical transaction attacks to how the...`,
    time: "9 min",
    link: "https://blog.fluidity.money/governance-and-fluidity-wars-steering-the-invisible-hand-e5a71afb2757",
  },
  {
    img: "https://miro.medium.com/max/1400/1*G69xgGXM_DE4w8uttbixZw.jpeg",
    title: "Tiki Talk Minutes: Fluidity x UXD, The future of stablecoins",
    desc: `In the days and weeks that followed the UST depegging, a lot of apocalyptic headlines prophesised the end of the great algorithmic stablecoin...`,

    time: "6 min",
    link: "https://blog.fluidity.money/fluidity-x-uxd-the-future-of-stablecoins-73766ff772c8",
  },
  {
    img: "https://miro.medium.com/max/700/1*gRGFqHLNDPUvkHi0kZYqag.jpeg",
    title:
      "Fluidity University Part 3: Utility Mining: A fairer token distribution strategy",
    desc: `In the first two parts of fluidity University, we've introduced the basics of how to distribute
    yield through spending and how the protocol protects itself against cheaters...`,
    time: "5 min",
    link: "https://blog.fluidity.money/fluidity-university-part-3-utility-mining-a-fairer-token-distribution-strategy-4008323aa1bb",
  },
  {
    img: "https://miro.medium.com/max/700/1*CJHj6OywDEjA2jSXoMVXTQ.png",
    title:
      "Fluidity University Part 2: Distributing yield through the Transfer Reward Function",
    desc: `In the first part of Fluidity University, we’ve seen how the protocol protects itself against fraudulent transactions by piggy backing off transaction fees...`,
    time: "4 min",
    link: "https://blog.fluidity.money/fluidity-university-part-2-distributing-yield-through-the-transfer-reward-function-b34941ec8f7e",
  },
  {
    img: "https://miro.medium.com/max/2400/0*vxcr4Z8urUbzFuuF",
    title:
      "Fluidity University Part 1: How does Fluidity protect itself against fraudulent transactions?",
    desc: `In the first part of our Fluidity University series, we’re diving into one of the most important aspects of Fluidity’s economics design: the Optimistic...`,
    time: "3 min",
    link: "https://blog.fluidity.money/fluidity-university-part-1-how-does-fluidity-protect-itself-against-frudulent-transactions-8dc39b4f5672",
  },
  {
    img: "https://miro.medium.com/max/1400/1*gf7Oq-XkH2oa5W_bG2G4vg.png",
    title: "Fluidity Solana Devnet Beta is Live!",
    desc: `Fluidity excitedly announces that our Beta is now live on the Solana Devnet! After an amazing Ethereum beta launch, we’d like our community to take part in testing our Solana web app. Prior to using the Fluidity...`,

    time: "4 min",
    link: "https://blog.fluidity.money/fluidity-solana-devnet-beta-is-live-751918993eb0",
  },
  {
    img: "https://miro.medium.com/max/1400/1*s-u6Tu1zhEOEYGLCP4RU1w.jpeg",
    title: "Attention all Fluiders. Fluidity Testnet V1 is Live.",
    desc: `We are thrilled to announce that after months of development, the Ethereum Testnet is live! We are aware you have been patient as we work towards our goal of bringing utility-derived yield to the masses and for that,...`,

    time: "3 min",
    link: "https://blog.fluidity.money/attention-all-fluiders-fluidity-testnet-v1-is-live-ff85fa86d042",
  },
  {
    img: "https://miro.medium.com/max/1400/1*cAdr7z1sD8DwXKw-0Nc5mw.png",
    title: "Introducing Fluidity",
    desc: `After months of quietly building, we are inviting everyone to help grow the future of money. Fluidity is launching soon and is excited to share with you the future of money. Money designed to move. Each time you spend or...`,

    time: "4 min",
    link: "https://blog.fluidity.money/introducing-fluidity-f201a0edc4c8",
  },
];
