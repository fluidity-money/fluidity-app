// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ContinuousCarousel, ManualCarousel } from "surfing";
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
  return (
    <>
      <ContinuousCarousel direction={"right"}>
        <div className={styles.carouselText}>
          <h2>FLUNIVERSITY</h2>
          <h2>FLUNIVERSITY</h2>
          <h2>FLUNIVERSITY</h2>
          <h2>FLUNIVERSITY</h2>
          <h2>FLUNIVERSITY</h2>
          <h2>FLUNIVERSITY</h2>
          <h2>FLUNIVERSITY</h2>
          <h2>FLUNIVERSITY</h2>
          <h2>FLUNIVERSITY</h2>
          <h2>FLUNIVERSITY</h2>
          <h2>FLUNIVERSITY</h2>
        </div>
      </ContinuousCarousel>
<div className={styles.container} id="fluniversity">
        <ManualCarousel>
          {items.map((item, index) => (
            <div key={index} className={styles.fluniversityCard}>
              <div className={styles.imgContainer}>
                <img src={item.img} />
              </div>

              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <span>{item.time} mins read</span>
              <span>
                <a href={item.link}>
                  FLUNIVERSITY <i>*</i>
                </a>
              </span>
            </div>
          ))}
        </ManualCarousel>
      </div>
    </>
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
