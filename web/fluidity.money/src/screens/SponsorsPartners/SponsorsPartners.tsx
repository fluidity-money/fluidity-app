// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import React from "react";
import ContinuousCarousel from "../../components/ContinuousCarousel";
import Partner from "../../components/Partner";
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
          <div>
            {partners.map((partner) => (
              <Partner
                img={partner.img}
                title={partner.title}
                info={partner.info}
              />
            ))}
          </div>
        </ContinuousCarousel>
        <ContinuousCarousel direction="up">
          <div>
            {partners.map((partner) => (
              <Partner
                img={partner.img}
                title={partner.title}
                info={partner.info}
              />
            ))}
          </div>
        </ContinuousCarousel>
        <ContinuousCarousel direction="up">
          <div>
            {partners.map((partner) => (
              <Partner
                img={partner.img}
                title={partner.title}
                info={partner.info}
              />
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
