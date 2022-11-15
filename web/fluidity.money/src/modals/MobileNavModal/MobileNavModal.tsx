// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { Heading } from "@fluidity-money/surfing";
import Image from "next/image";
import styles from "./MobileNavModal.module.scss";

interface IMobileNavModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navLinks: string[];
}

const MobileNavModal = ({ navLinks, setIsOpen }: IMobileNavModalProps) => {
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
      <a href={"/"}>
        <Image
          src="/assets/images/logoMetallic.png"
          alt="logo"
          width="160"
          height="68"
          priority={true}
          loading="eager"
        />
      </a>

      {links}

      <div className={styles.socials}>
        <a
          href="https://twitter.com/fluiditymoney"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image
            src="/assets/images/socials/twitter.svg"
            alt="twitter"
            height={24}
            width={24}
            priority={true}
            loading="eager"
          />
        </a>
        <a
          href="https://discord.gg/CNvpJk4HpC"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image
            src="/assets/images/socials/discord.svg"
            alt="discord"
            height={24}
            width={24}
            priority={true}
            loading="eager"
          />
        </a>
        <a
          href="https://t.me/fluiditymoney"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image
            src="/assets/images/socials/telegram.svg"
            alt="telegram"
            height={24}
            width={24}
            priority={true}
            loading="eager"
          />
        </a>
        <a
          href="https://www.linkedin.com/company/74689228/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image
            src="/assets/images/socials/linkedin.svg"
            alt="linkedin"
            height={24}
            width={24}
            priority={true}
            loading="eager"
          />
        </a>
      </div>

      <a
        className={`${styles.whiteButton} ${styles.smaller}`}
        href={`#demo`}
        onClick={() => setIsOpen(false)}
      >
        <Heading className={styles.black} black={true} as="h3">
          LAUNCH FLUIDITY
        </Heading>
      </a>
      <a
        className={`${styles.button} ${styles.smaller}`}
        href="mailto:contact@fluidity.money"
      >
        <Heading as="h3">LET'S CHAT</Heading>
      </a>
    </div>
  );
};

export default MobileNavModal;
