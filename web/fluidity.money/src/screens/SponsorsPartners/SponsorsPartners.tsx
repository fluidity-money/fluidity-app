// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { ContinuousCarousel, Partner, Card } from "surfing";
import styles from "./SponsorsPartners.module.scss";

const SponsorsPartners = () => {
  /*
  vertical continuously flowing carousel of boxes containing sponsor and partner logo/name,
  on hover, more info is provided
  */

  return (
    <div className={`${styles.container} bg-dark`}>
      <h1 className={styles.text}>{"Sponsors & Partners"}</h1>
      <div style={{ display: "flex", width: "100%" }}>
        <ContinuousCarousel direction="up">
          <div
            style={{
              width: "100%",
              // position: "relative",
              // display: "block",
              // top: `${Math.floor((Math.random() - 0.5) * 500)}px`,
              // left: `${Math.floor((Math.random() - 0.6) * 900)}px`,
            }}
          >
            {partners.map((partner, i) => (
              <Card
                rounded={true}
                type={"transparent"}
                key={`sponsor-${i}`}
                style={{
                  position: "relative",
                  display: "flex",
                  top: `0`,
                  left: `${Math.floor(Math.random() * (1150 - 1) + 1)}px`,
                  filter: `${Math.floor(Math.random() * (3 - 1) + 1) === 1 ? 'blur(8px)' : 'blur(0px)'}`
                }}
              >
                <Partner
                  img={partner.img}
                  title={partner.title}
                  info={partner.info}
                />
              </Card>
            ))}
          </div>
        </ContinuousCarousel>
      </div>
    </div>
  );
};

export default SponsorsPartners;

// array of array of array of 4 objects at a time
const partners = [
  {
    img: "🦍",
    title: "ApeChain",
    info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos qui velit culpa voluptates quam ea accusantium!Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos qui velit culpa voluptates quam ea accusantium!",
  },
  {
    img: "🦍",
    title: "ApeChain",
    info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos qui velit culpa voluptates quam ea accusantium!",
  },
  {
    img: "🦍",
    title: "ApeChain",
    info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos qui velit culpa voluptates quam ea accusantium!",
  },
  {
    img: "🦍",
    title: "ApeChain",
    info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos qui velit culpa voluptates quam ea accusantium!",
  },

  {
    img: "🦍",
    title: "ApeChain",
    info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos qui velit culpa voluptates quam ea accusantium!",
  },
  {
    img: "🦍",
    title: "ApeChain",
    info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos qui velit culpa voluptates quam ea accusantium!",
  },
  {
    img: "🦍",
    title: "ApeChain",
    info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos qui velit culpa voluptates quam ea accusantium!",
  },
  {
    img: "🦍",
    title: "ApeChain",
    info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos qui velit culpa voluptates quam ea accusantium!",
  },

  {
    img: "🦍",
    title: "ApeChain",
    info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos qui velit culpa voluptates quam ea accusantium!",
  },
  {
    img: "🦍",
    title: "ApeChain",
    info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos qui velit culpa voluptates quam ea accusantium!",
  },
  {
    img: "🦍",
    title: "ApeChain",
    info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos qui velit culpa voluptates quam ea accusantium!",
  },
  {
    img: "🦍",
    title: "ApeChain",
    info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos qui velit culpa voluptates quam ea accusantium!",
  },
  {
    img: "🦍",
    title: "ApeChain",
    info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos qui velit culpa voluptates quam ea accusantium!",
  },
  {
    img: "🦍",
    title: "ApeChain",
    info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos qui velit culpa voluptates quam ea accusantium!",
  },

  {
    img: "🦍",
    title: "ApeChain",
    info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos qui velit culpa voluptates quam ea accusantium!",
  },
  {
    img: "🦍",
    title: "ApeChain",
    info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos qui velit culpa voluptates quam ea accusantium!",
  },
  {
    img: "🦍",
    title: "ApeChain",
    info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos qui velit culpa voluptates quam ea accusantium!",
  },
];
