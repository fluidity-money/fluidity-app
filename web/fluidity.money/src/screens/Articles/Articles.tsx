// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useEffect } from "react";
import {
  ArticleCard,
  ArticleList,
  ArticleListProps,
} from "../../components/Article";
import { useLocation } from "react-router-dom";
import styles from "./Articles.module.scss";
import { ContinuousCarousel, Heading } from "@fluidity-money/surfing";

interface IArticleProps {
  isResourcesPage?: boolean;
}

const Articles = ({ isResourcesPage }: IArticleProps) => {
  /* scrolls to location on pageload if it contains same ID or scrolls to the top
   for ResourcesNavModal to work*/
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      let elem = document.getElementById(location.hash.slice(1));
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [location]);

  const callout = (
    <div className={styles.callout}>
      <Heading hollow={true} as="h4" className={styles.text}>
        RESOURCES RESOURCES RESOURCES
      </Heading>
      <Heading as="h4" className={styles.text}>
        RESOURCES
      </Heading>
    </div>
  );

  return (
    <div className={styles.outerContainer}>
      <div className={styles.carousel}>
        {
          !(isResourcesPage) ? (
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
          </ContinuousCarousel>): ''
        }
      </div>
      <div className={styles.container} id="articles">
        <ArticleCard
          id={0}
          img={"https://miro.medium.com/max/700/1*lyOtA25-N4ldnJKK4J4tKA.png"}
          title={arr.articles[0].title}
          desc={arr.articles[0].desc}
          info={arr.articles[0].info}
          isResourcesPage={isResourcesPage}
        />
        <ArticleList {...arr} />
      </div>
    </div>
  );
};

export default Articles;

const arr: ArticleListProps = {
  articles: [
    {
      id: 0,
      title: "With Fluidity, supercharge your arbitrage trades",
      desc: `Crypto assets worth billions of dollars are traded every single day. Arbitrage traders take advantage of the volatility and pricing imperfections, exploiting different values for the same asset across different markets. Take...`,
      info: "9 min read ARBITRAGE",
      link: "",
      linkTitle: "",
    },
    {
      id: 1,
      title: "The Hunting of the zk-SNARK: Homomorphic Hidings",
      desc: `“But the Judge said he never had summed up before; So the Snark undertook it instead, And summed it so well that it came to far more Than the Witnesses ever had said!” Lewis Carroll Zero-knowledge succinct non...`,
      info: "5 min read CRYPTOCURRENCY",
      link: "",
      linkTitle: "",
    },
    {
      id: 2,
      title: "An alternative solution to Uniswap’s “fee switch” problem",
      desc: `In the past few months, there has been a lot of discussion in the Uniswap Governance Forum about activating the “fee switch”, a piece of code that...`,
      info: "6 min read UNISWAP",
      link: "",
      linkTitle: "",
    },
    {
      id: 3,
      title: "Tiki Talk Minutes: Fluidity x DOPEX x Arbitrum and the evolving boundaries of DeFi",
      desc: `The year 2020 marked the explosion of DeFi protocols in public imagination, driven largely by the rise of liquidity mining — Compound...`,
      info: "5 min  read ARBITRUM",
      link: "",
      linkTitle: "",
    },
    {
      id: 4,
      title: "Ghost in the machine: Fluidity Partners with AAVE Grants DAO",
      desc: `“2022 has been a wild year for Decentralized Finance. Novel concepts were introduced and big scandals were reported, but most importantly, DeFi has...`,
      info: "5 min read CRYPTOCURRENCY",
      link: "",
      linkTitle: "",
    },
    {
      id: 5,
      title: "Fluidity 🌊💸— Using Chainlink VRF to power the future of money", 
      desc: `Providing Users With a Secure Source of Verifiable Randomness Fluidity — Next-Generation Assets If your money’s on the move, exposure to DeFi can...`,
      info: "4 min read FLUIDITY",
      link: "",
      linkTitle: "",
    },
    // {
    //   id: 6,
    //   title:
    //     "Fluidity x MakerDAO Tiki Talk: Rethinking the stablecoin paradigm",
    //   desc: `A month into the UST crash, Ethereum co-founder Vitalik Buterin shared a thought experiment on a question that was on everybody’s lips. How could...`,
    //   info: "6 min read MAKERDAO",
    // },
    // {
    //   id: 7,
    //   title:
    //     "Primer on Stablecoins & Lessons from UST collapse: Stablecoins need utility",
    //   desc: `On May 9, the Terra USD (UST) stablecoin in the Terra ecosystem showed the first signs of “depegging”. The value of UST is algorithmically secured to...`,
    //   info: "11 min read STABLE COIN",
    // },
    // {
    //   id: 8,
    //   title: "Governance and Fluidity Wars: Steering the Invisible Hand",
    //   desc: `In our previous educational posts, we have outlined the basic economics of a Fluid Asset, from preventing cyclical transaction attacks to how the...`,
    //   info: "9 min read GOVERNANCE",
    // },
    // {
    //   id: 9,
    //   title: "Tiki Talk Minutes: Fluidity x UXD, The future of stablecoins",
    //   desc: `In the days and weeks that followed the UST depegging, a lot of apocalyptic headlines prophesised the end of the great algorithmic stablecoin...`,
    //   info: "6 min read STABLECOIN CRYPTOCURRENCY",
    // },
    // {
    //   id: 10,
    //   title:
    //     "Fluidity University Part 3: Utility Mining: A fairer token distribution strategy",
    //   desc: `In the first two parts of Fluidity University, we’ve introduced the basics of how to distribute yield through spending and how the protocol protects...`,
    //   info: "5 min read FLUNIVERSITY",
    // },
    // {
    //   id: 11,
    //   title:
    //     "Fluidity University Part 2: Distributing yield through the Transfer Reward Function",
    //   desc: `In the first part of Fluidity University, we’ve seen how the protocol protects itself against fraudulent transactions by piggy backing off transaction fees...`,
    //   info: "4 min read FLUNIVERSITY",
    // },
    // {
    //   id: 12,
    //   title:
    //     "Fluidity University Part 1: How does Fluidity protect itself against fraudulent transactions?",
    //   desc: `In the first part of our Fluidity University series, we’re diving into one of the most important aspects of Fluidity’s economics design: the Optimistic...`,
    //   info: "3 min read FLUNIVERSITY",
    // },
    // {
    //   id: 13,
    //   title: "Fluidity Solana Devnet Beta is Live!",
    //   desc: `Fluidity excitedly announces that our Beta is now live on the Solana Devnet! After an amazing Ethereum beta launch, we’d like our community to take part in testing our Solana web app. Prior to using the Fluidity...`,
    //   info: "4 min read FLUIDITY",
    // },
    // {
    //   id: 14,
    //   title: "Attention all Fluiders. Fluidity Testnet V1 is Live.",
    //   desc: `We are thrilled to announce that after months of development, the Ethereum Testnet is live! We are aware you have been patient as we work towards our goal of bringing utility-derived yield to the masses and for that,...`,
    //   info: "3 min read BLOCKCHAIN",
    // },
    // {
    //   id: 15,
    //   title: "Introducing Fluidity",
    //   desc: `After months of quietly building, we are inviting everyone to help grow the future of money. Fluidity is launching soon and is excited to share with you the future of money. Money designed to move. Each time you spend or...`,
    //   info: "4 min read FLUNIVERSITY",
    // },
  ],
};
