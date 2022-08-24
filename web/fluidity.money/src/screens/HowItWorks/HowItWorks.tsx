// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import React, { useEffect, useState } from "react";
import { GeneralButton } from "../../components/Button";
import styles from "./HowItWorks.module.scss";

const HowItWorks = () => {
  /* 3 paragraphs on the left, 
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
          <GeneralButton
            version={"primary"}
            type={"text"}
            size={"medium"}
            handleClick={() => {}}
          >
            MORE ON HOW IT WORKS
          </GeneralButton>
        </div>
        <div className={styles.right}>
          <div>{currentImage}</div>
        </div>
      </div>

      <div className={styles.footer}>
        <h1>HOW</h1>
        <h1>FLUIDITY</h1>
        <h1>WORKS</h1>
      </div>
    </div>
  );
};

export default HowItWorks;
