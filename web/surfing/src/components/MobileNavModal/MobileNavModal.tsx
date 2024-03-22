// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { GeneralButton } from "../Button";
import { Heading } from "../Heading";
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
  //./src/assets/images/triangleDown.svg
  return (
    <div className={styles.container}>
      <div className={styles.imgContainer}>
        <a href={"/"}>
          <img src="./src/assets/images/logos/.png" alt="logo" />
        </a>
      </div>

      {links}

      <div className={styles.socials}>
        <a href="https://x.com/fluiditylabs">
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

      <GeneralButton
        type={"primary"}
        size={"large"}
        handleClick={() => {}}
      >
        LAUNCH FLUIDITY
      </GeneralButton>
      <GeneralButton
        type={"secondary"}
        size={"large"}
        handleClick={() => {}}
      >
        DISCORD
      </GeneralButton>
    </div>
  );
};

export default MobileNavModal;
