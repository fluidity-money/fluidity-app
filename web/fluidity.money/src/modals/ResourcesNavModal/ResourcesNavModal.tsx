// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.
import { LinkButton } from "components/Button";
import React from "react";
import { Link } from "react-router-dom";
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
          <a onClick={() => handleModal()} href={`/resources#${link.children}`}>
            <LinkButton
              size={link.size}
              type={link.type}
              handleClick={() => {}}
            >
              {link.children}
            </LinkButton>
          </a>
        </h4>
      ))}
      <div className={styles.socials}>
        <img src="/assets/images/socials/twitter.svg" />
        <img src="/assets/images/socials/discord.svg" />
        <img src="/assets/images/socials/telegram.svg" />
      </div>
    </div>
  );
};

export default ResourcesNavModal;
