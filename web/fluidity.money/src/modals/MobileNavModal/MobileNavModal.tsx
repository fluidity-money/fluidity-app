// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { GeneralButton } from "surfing";
import styles from "./MobileNavModal.module.scss";

interface IMobileNavModalProps {
  navLinks: string[];
}

const MobileNavModal = ({ navLinks }: IMobileNavModalProps) => {
  const links = navLinks.map((link) => (
    <a href={`/${link.replace(/\s+/g, "")}`}>
      <GeneralButton
        version={"secondary"}
        type={"text"}
        size={"large"}
        handleClick={() => {}}
      >
        {link}
      </GeneralButton>
    </a>
  ));

  return (
    <div className={styles.container}>
      <img src="/assets/images/logoOutline.svg" alt="logo" />
      {links}
      <GeneralButton
        version={"primary"}
        type={"text"}
        size={"large"}
        handleClick={() => {}}
      >
        LAUNCH FLUIDITY
      </GeneralButton>
      <GeneralButton
        version={"secondary"}
        type={"text"}
        size={"large"}
        handleClick={() => {}}
      >
        LET'S CHAT
      </GeneralButton>
      <div className={styles.socials}>
        <img src="/assets/images/socials/twitter.svg" alt="twitter" />
        <img src="/assets/images/socials/discord.svg" alt="discord" />
        <img src="/assets/images/socials/telegram.svg" alt="telegram" />
        <img src="/assets/images/socials/linkedin.svg" alt="linkedin" />
      </div>
    </div>
  );
};

export default MobileNavModal;
