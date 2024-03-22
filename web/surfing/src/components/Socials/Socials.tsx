// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { ContinuousCarousel } from "../Container";
import Text from "../Text";
import styles from "./Socials.module.scss";

const Socials = () => {
  const repeatingSocials = (
    <>
      <a
        href="https://x.com/fluiditylabs"
        className={styles.social}
        rel="noopener noreferrer"
        target="_blank"
      >
        <div className={styles.imageContainer}>
          <img src="/assets/images/socials/twitter.svg" alt="twitter" />
        </div>
        <Text as="p" prominent={true} className={styles.socialText}>
          @FLUIDITYMONEY
        </Text>
      </a>
      <a
        href="https://discord.gg/CNvpJk4HpC"
        className={styles.social}
        rel="noopener noreferrer"
        target="_blank"
      >
        <div className={styles.imageContainer}>
          <img src="/assets/images/socials/discord.svg" alt="discord" />
        </div>
        <Text as="p" prominent={true} className={styles.socialText}>
          DISCORD
        </Text>
      </a>

      <a
        href="https://t.me/fluiditymoney"
        className={styles.social}
        rel="noopener noreferrer"
        target="_blank"
      >
        <div className={styles.imageContainer}>
          <img src="/assets/images/socials/telegram.svg" alt="telegram" />
        </div>
        <Text as="p" prominent={true} className={styles.socialText}>
          TELEGRAM
        </Text>
      </a>
      <a
        href="https://www.linkedin.com/company/74689228/"
        className={styles.social}
        rel="noopener noreferrer"
        target="_blank"
      >
        <div className={styles.imageContainer}>
          <img src="/assets/images/socials/linkedin.svg" alt="linkedin" />
        </div>
        <Text as="p" prominent={true} className={styles.socialText}>
          LINKEDIN
        </Text>
      </a>
    </>
  );

  return (
    <div className={styles.container}>
      <ContinuousCarousel direction="right">
        <div className={styles.content}>
          {repeatingSocials}
          {repeatingSocials}
          {repeatingSocials}
          {repeatingSocials}
          {repeatingSocials}
          {repeatingSocials}
          {repeatingSocials}
          {repeatingSocials}
          {repeatingSocials}
          {repeatingSocials}
          {repeatingSocials}
          {repeatingSocials}
        </div>
      </ContinuousCarousel>
    </div>
  );
};

export default Socials;
