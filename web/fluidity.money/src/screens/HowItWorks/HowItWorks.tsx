// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import Video from "components/Video";
import { useEffect, useState } from "react";
import { ContinuousCarousel, LinkButton } from "@fluidity-money/surfing";
import styles from "./HowItWorks.module.scss";

const HowItWorks = () => {
  /* 
  carousels at the top,
  3 paragraphs on the left, 
  image on the right,
  paragraph highlighted has different specific image,
  scrolls thought automatically and constantly
   */
  const images = [
    "/assets/videos/Fluidity_Wrap.mp4",
    "/assets/videos/Fluidity_Yield.mp4",
    "/assets/videos/Fluidity_HowItWorks.mp4",
  ];
  const [currentImage, setCurrentImage] = useState(
    "/assets/videos/Fluidity_Wrap.mp4"
  );

  useEffect(() => {
    let counter = 0;
    const intervalId = setInterval(() => {
      setCurrentImage(images[counter]);
      counter++;
      if (counter === 3) counter = 0;
    }, 7000);

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
          <p
            className={
              currentImage === "/assets/videos/Fluidity_Wrap.mp4"
                ? styles.bold
                : styles.normal
            }
          >
            Fluid assets are a 1:1 wrapped asset with perpetual payout
            properties.
          </p>
          <p
            className={
              currentImage === "/assets/videos/Fluidity_Yield.mp4"
                ? styles.bold
                : styles.normal
            }
          >
            They distribute yield when when used on any on-chain use-case. Yiled
            is gained through utility.
          </p>
          <p
            className={
              currentImage === "/assets/videos/Fluidity_HowItWorks.mp4"
                ? styles.bold
                : styles.normal
            }
          >
            The user is incentivised through governance.
          </p>
          <a href="/howitworks">
            <LinkButton
              type={"internal"}
              size={"medium"}
              handleClick={() => {}}
            >
              HOW IT WORKS
            </LinkButton>
          </a>
        </div>
        <div className={styles.right}>
          {currentImage === "/assets/videos/Fluidity_Wrap.mp4" ? (
            <div>
              <Video
                src={
                  window.location.origin + "/assets/videos/Fluidity_Wrap.mp4"
                }
                type={"fit"}
                view={"normal"}
                loop={true}
                key={"abc"}
              />
            </div>
          ) : currentImage === "/assets/videos/Fluidity_Yield.mp4" ? (
            <div>
              <Video
                src={
                  window.location.origin + "/assets/videos/Fluidity_Yield.mp4"
                }
                type={"fit"}
                view={"normal"}
                loop={true}
                key={"xyz"}
              />
            </div>
          ) : (
            <div>
              <Video
                src={
                  window.location.origin +
                  "/assets/videos/Fluidity_HowItWorks.mp4"
                }
                type={"fit"}
                view={"normal"}
                loop={true}
                key={"jfk"}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
