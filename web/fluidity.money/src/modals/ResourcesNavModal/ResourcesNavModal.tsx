// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { LinkButton } from "@fluidity-money/surfing";
import Link from "next/link";
import styles from "./ResourcesNavModal.module.scss";

interface IResourcesNavModal {
  handleModal: () => void;
  navLinks: ILinkButton[];
}

interface ILinkButton {
  children: string;
  size: "small" | "medium" | "large";
  type: "internal" | "external";
  handleClick: () => void;
}

const ResourcesNavModal = ({ handleModal, navLinks }: IResourcesNavModal) => {
  // if page is alredy on resources href id only otherwise switch page and then id
  return (
    <div className={styles.container}>
      {navLinks.map((link) => (
        <h4>
          <Link
            href={`/resources#${link.children}`}
            passHref
          >
            <a onClick={() => handleModal()} href={`/resources#${link.children}`}>
              <LinkButton
                size={link.size}
                type={link.type}
                handleClick={() => {}}
              >
                {link.children}
              </LinkButton>
            </a>
          </Link>
        </h4>
      ))}
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
    </div>
  );
};

export default ResourcesNavModal;
