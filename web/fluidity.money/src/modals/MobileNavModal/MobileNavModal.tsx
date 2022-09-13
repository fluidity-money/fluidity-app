// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { GeneralButton, Heading } from "@fluidity-money/surfing";
import styles from "./MobileNavModal.module.scss";

interface IMobileNavModalProps {
  navLinks: string[];
}

const MobileNavModal = ({ navLinks }: IMobileNavModalProps) => {
  const links = navLinks.map((link) => (
    <a
      className={styles.button}
      href={`/${link.replace(/\s+/g, "").toLowerCase()}`}
    >
      <Heading as="h3">{link}</Heading>
    </a>
  ));

  return (
    <div className={styles.container}>
      <div className={styles.imgContainer}>
        <a href={"/"}>
          <img src="/assets/images/logoMetallic.png" alt="logo" />
        </a>
      </div>

      {links}

      <div className={styles.socials}>
        <a href="https://twitter.com/fluiditymoney">
          <img src="/assets/images/socials/twitter.svg" alt="twitter" />
        </a>
        <a href="https://discord.gg/CNvpJk4HpC">
          <img src="/assets/images/socials/discord.svg" alt="discord" />
        </a>
        <a href="https://t.me/fluiditymoney">
          <img src="/assets/images/socials/telegram.svg" alt="telegram" />
        </a>
        <a href="https://www.linkedin.com/company/74689228/">
          <img src="/assets/images/socials/linkedin.svg" alt="linkedin" />
        </a>
      </div>

      <a className={`${styles.whiteButton} ${styles.smaller}`} href={``}>
        <Heading className={styles.black} black={true} as="h3">
          LAUNCH FLUIDITY
        </Heading>
      </a>
      <a className={`${styles.button} ${styles.smaller}`} href={``}>
        <Heading as="h3">LET'S CHAT</Heading>
      </a>
    </div>
  );
};

export default MobileNavModal;
