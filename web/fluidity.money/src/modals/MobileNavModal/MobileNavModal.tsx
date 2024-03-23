// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { Text } from "@fluidity-money/surfing";
import Image from "next/image";
import Link from "next/link";
import styles from "./MobileNavModal.module.scss";

interface IMobileNavModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navLinks: string[];
}

const MobileNavModal = ({ navLinks, setIsOpen }: IMobileNavModalProps) => {
  const links = navLinks.map((link) => (
    <Link href={`/${link.replace(/\s+/g, "").toLowerCase()}`} passHref>
      <a
        className={styles.button}
        href={`/${link.replace(/\s+/g, "").toLowerCase()}`}
        onClick={() => setIsOpen(false)}
      >
        <Text code prominent>{link}</Text>
      </a>
    </Link>
  ));

  return (
    <div className={styles.container}>
      <Link href={"/"} passHref>
        <a href={"/"} className={styles.logo} onClick={() => setIsOpen(false)}>
          <Image
            src="/assets/images/logoOutline.png"
            alt="logo"
            width="160"
            height="68"
            priority={true}
            loading="eager"
          />
        </a>
      </Link>

      {links}

      <div className={styles.socials}>
        <a
          href="https://x.com/fluiditylabs"
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
        className={`${styles.whiteButton}`}
        href={`https://app.fluidity.money`}
        onClick={() => setIsOpen(false)}
      >
        <Text code style={{ color: "black" }} prominent>
          LAUNCH FLUIDITY
        </Text>
      </a>
      <a
        className={`${styles.button}`}
        href="https://discord.gg/fluidity"
      >
        <Text code prominent>DISCORD</Text>
      </a>
    </div >
  );
};

export default MobileNavModal;
