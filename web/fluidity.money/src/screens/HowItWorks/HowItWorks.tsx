// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useEffect, useState } from "react";
import { ContinuousCarousel, LinkButton } from "surfing";
import styles from "./HowItWorks.module.scss";

const HowItWorks = () => {
  /* 
  carousels at the top,
  3 paragraphs on the left, 
  image on the right,
  paragraph highlighted has different specific image,
  scrolls thought automatically and constantly
   */
  const images = ["🦍", "🦍 🦍", "🦍 🦍 🦍"];
  const [currentImage, setCurrentImage] = useState("Image 1");

  useEffect(() => {
    let counter = 0;
    const intervalId = setInterval(() => {
      setCurrentImage(images[counter]);
      counter++;
      if (counter === 3) counter = 0;
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={`${styles.container} bg-dark`}>
      <ContinuousCarousel direction={"right"}>
        <div className={styles.text}>
          <div>HOW IT WORKS</div>
          <div>HOW IT WORKS</div>
          <div>HOW IT WORKS</div>
          <div>HOW IT WORKS</div>
          <div>HOW IT WORKS</div>
          <div>HOW IT WORKS</div>
          <div>HOW IT WORKS</div>
          <div>HOW IT WORKS</div>
          <div>HOW IT WORKS</div>
          <div>HOW IT WORKS</div>
          <div>HOW IT WORKS</div>
          <div>HOW IT WORKS</div>
          <div>HOW IT WORKS</div>
          <div>HOW IT WORKS</div>
          <div>HOW IT WORKS</div>
          <div>HOW IT WORKS</div>
          <div>HOW IT WORKS</div>
        </div>
      </ContinuousCarousel>
      <div className={styles.grid}>
        <div className={styles.left}>
          <p className={currentImage === "🦍" ? styles.bold : styles.normal}>
            Fluid assets are a 1:1 wrapped asset with perpetual payout
            properties.
          </p>
          <p className={currentImage === "🦍 🦍" ? styles.bold : styles.normal}>
            They distribute yield when when used on any on-chain use-case. Yiled
            is gained through utility.
          </p>
          <p
            className={
              currentImage === "🦍 🦍 🦍" ? styles.bold : styles.normal
            }
          >
            The user is incentivised through governance.
          </p>
          <LinkButton type={"internal"} size={"medium"} handleClick={() => {}}>
            HOW IT WORKS
          </LinkButton>
        </div>
        <div className={styles.right}>
          <div>{currentImage}</div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
