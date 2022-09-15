// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import type { ReactComponentElement } from "react";
import type { SupportedChainsList } from "~/util/chainProviders/chains";
import type { IBlockchainModal } from "~/components/Modal/BlockchainModal/BlockchainModal";

import { ReactComponent as Checkmark } from "~/assets/images/buttonIcons/Checkmark.svg";
import { Card, Heading, Text } from "~/components";
import { SupportedChains } from "~/util";
import styles from "./MobileBlockchainModal.module.scss";


const MobileBlockchainModal = (props: IBlockchainModal) => {
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

      <GeneralButton
        version={"primary"}
        buttonType={"text"}
        size={"large"}
        handleClick={() => {}}
      >
        LAUNCH FLUIDITY
      </GeneralButton>
      <GeneralButton
        version={"secondary"}
        buttonType={"text"}
        size={"large"}
        handleClick={() => {}}
      >
        LET'S CHAT
      </GeneralButton>
    </div>
  );
};

export default MobileNavModal;
