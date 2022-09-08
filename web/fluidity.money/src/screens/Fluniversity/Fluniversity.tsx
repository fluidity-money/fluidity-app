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
            <div key={index} className={styles.fluniversityCard}>
              <div className={styles.imgContainer}>
                <img src={item.img} />
              </div>

              <Heading as="h4">{item.title}</Heading>
              <Text as="p">{item.desc}</Text>
              <Text>{item.time} mins read</Text>
              <Text>
                <a href={item.link}>
                  FLUNIVERSITY <i>*</i>
                </a>
              </Text>
            </div>
          ))}
        </ManualCarousel>
      </div>
    </div>
  );
};

export default Fluniversity;

const items = [
  {
    img: "https://miro.medium.com/max/700/1*HJbEUecOrcNxPDBK4vHZSQ.jpeg",
    title: "Governance and Fluidity Wars: Steering the Invisible Hand",
    desc: `In our previous educational posts, we have outlined the basic economics of a Fluid Asset, from preventing cyclical transaction attacks to how the...`,
    time: "9 min",
    link: "https://blog.fluidity.money/governance-and-fluidity-wars-steering-the-invisible-hand-e5a71afb2757",
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
];
