// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  ContinuousCarousel,
  ManualCarousel,
  Heading,
  Text,
  LinkButton,
} from "@fluidity-money/surfing";
import styles from "./Docs.module.scss";
import useViewport from "hooks/useViewport";

const Docs = () => {
  const { width } = useViewport();
  const callout = (
    <div className={styles.callout}>
      <Heading hollow={true} as="h4" className={styles.text}>
        DOCUMENTATION DOCUMENTATION
      </Heading>
      <Heading as="h4" className={styles.text}>
        DOCUMENTATION
      </Heading>
    </div>
  );

  return (
    <div id="documentation">
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
        <ManualCarousel scrollBar={width < 500 ? true : false}>
          {items.map((item, index) => (
            <a href={item.link} rel="noopener noreferrer" target="_blank">
              <div key={index} className={styles.docsCard}>
                <div className={styles.imgContainer}>
                  {/* <img src={item.img} alt="carousel-object" /> */}
                  <span
                    role="img"
                    title="crystal ball"
                    aria-label="crystal ball"
                  >
                    {item.img}
                  </span>
                </div>
                <div className={styles.content}>
                  <Heading as="h3">{item.title}</Heading>
                  <a href={item.link} rel="noopener noreferrer" target="_blank">
                    <LinkButton
                      size={"medium"}
                      type={"external"}
                      handleClick={() => {}}
                    >
                      DOCS
                    </LinkButton>
                  </a>
                </div>
              </div>
            </a>
          ))}
        </ManualCarousel>
        <div className={styles.allDocs}>
          <a href={"https://docs.fluidity.money/</div>"}>
            <LinkButton
              size={"medium"}
              type={"external"}
              handleClick={() => {}}
            >
              ALL DOCS
            </LinkButton>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Docs;

const items = [
  {
    img: "🔮",
    title: "Why Fluidity?",
    link: "https://docs.fluidity.money/docs/learning-and-getting-started/why-fluidity",
  },
  {
    img: "❓",
    title: "What are Fluid Assets?",
    link: "https://docs.fluidity.money/docs/learning-and-getting-started/what-are-fluid-assets",
  },
  {
    img: "🌟",
    title: "How do you get a Fluid Asset?",
    link: "https://docs.fluidity.money/docs/learning-and-getting-started/how-do-you-get-a-fluid-asset",
  },
  {
    img: "💰",
    title: "How are the rewards earned?",
    link: "https://docs.fluidity.money/docs/learning-and-getting-started/how-are-the-rewards-earned",
  },
  {
    img: "🗃",
    title: "The Economics of a Fluid Asset",
    link: "https://docs.fluidity.money/docs/learning-and-getting-started/the-economics-of-a-fluid-asset",
  },
];
