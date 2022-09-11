// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import Video from "components/Video";
import { useEffect, useState } from "react";
import {
  ContinuousCarousel,
  Heading,
  LinkButton,
  Text,
} from "@fluidity-money/surfing";
import styles from "./HowItWorks.module.scss";
import useViewport from "hooks/useViewport";

const HowItWorks = () => {
  /* 
  carousels at the top,
  3 paragraphs on the left, 
  image on the right,
  paragraph highlighted has different specific image,
  scrolls thought automatically and constantly
   */
  const images = [
    "/assets/videos/FluidityWrap.mp4",
    "/assets/videos/FluidityYield.mp4",
    "/assets/videos/FluidityHowItWorks.mp4",
  ];
  const [currentImage, setCurrentImage] = useState(
    "/assets/videos/FluidityWrap.mp4"
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

  const { width } = useViewport();
  const size = width > 1000 ? "h3" : width < 1000 && width > 520 ? "h4" : "h5";

  const backgroundText =
    currentImage === "/assets/videos/FluidityWrap.mp4"
      ? "FLUIDIFY"
      : currentImage === "/assets/videos/FluidityYield.mp4"
      ? "YIELD"
      : "GOVERN";

  const callout = (
    <div className={styles.callout}>
      <Heading hollow={true} as="h4" className={styles.text}>
        HOW IT WORKS HOW IT WORKS HOW IT WORKS
      </Heading>
      <Heading as="h4" className={styles.text}>
        HOW IT WORKS
      </Heading>
    </div>
  );

  return (
    <div className={`${styles.container} bg-dark`}>
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

      <div className={styles.grid}>
        <div className={styles.left}>
          <Text
            as={"p"}
            className={
              currentImage === "/assets/videos/FluidityWrap.mp4"
                ? styles.bold
                : styles.normal
            }
          >
            Fluid assets are a 1:1 wrapped asset with perpetual payout
            properties.
          </Text>
          <Text
            as={"p"}
            className={
              currentImage === "/assets/videos/FluidityYield.mp4"
                ? styles.bold
                : styles.normal
            }
          >
            They distribute yield when when used on any on-chain use-case. Yiled
            is gained through utility.
          </Text>
          <Text
            as={"p"}
            className={
              currentImage === "/assets/videos/FluidityHowItWorks.mp4"
                ? styles.bold
                : styles.normal
            }
          >
            The user is incentivised through governance.
          </Text>
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
          <div className={styles.backgroundText}>
            {<Heading as={size}>{backgroundText}</Heading>}
          </div>

          {currentImage === "/assets/videos/FluidityWrap.mp4" ? (
            <div>
              <Video
                src={
                  window.location.origin + "/assets/videos/FluidityWrap.mp4"
                }
                type={"fit"}
                loop={true}
                key={"abc"}
                scale={0.8}
              />
            </div>
          ) : currentImage === "/assets/videos/FluidityYield.mp4" ? (
            <div>
              <Video
                src={
                  window.location.origin + "/assets/videos/FluidityYield.mp4"
                }
                type={"fit"}
                loop={true}
                key={"xyz"}
              />
            </div>
          ) : (
            <div>
              <Video
                src={
                  window.location.origin +
                  "/assets/videos/FluidityHowItWorks.mp4"
                }
                type={"fit"}
                loop={true}
                key={"jfk"}
                scale={0.7}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
