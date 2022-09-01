// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import React, { ReactNode, useState } from "react";
import { GeneralButton } from "../Button";
import NavBarModal from "../NavBarModal";

import styles from "./NavBar.module.scss";

interface IButton {
  children: string;
  version: "primary" | "secondary";
  type: "text" | "icon before" | "icon after" | "icon only";
  size: "small" | "medium" | "large";
  handleClick: () => void;
}

interface INavLinks {
  name: string;
  modal: boolean;
  modalInfo?: IModalProps;
}

interface INavBarProps {
  logo: string;
  text: string;
  button: IButton;
  navLinks: INavLinks[];
}

interface ILinkButton {
  children: string;
  size: "small" | "medium" | "large";
  type: "internal" | "external";
  handleClick: () => void;
}

interface IModalProps {
  navLinks: string[];
  modalButtons: ILinkButton[];
}

const NavBar = ({ logo, text, button, navLinks }: INavBarProps) => {
  const [modal, setModal] = useState(false);
  const handleModal = () => {
    setModal(!modal);
  };

  const navLinksTitles = navLinks.map((link) => (
    <li>
      <a
        href={`/${link.name.replace(/\s+/g, "")}`}
        className={
          window.location.pathname.toString() ===
          `/${link.name.replace(/\s+/g, "")}`
            ? styles.active
            : ""
        }
      >
        {link.name.toUpperCase()}
      </a>
      {link.modal && (
        <button onClick={() => handleModal()}>
          <img
            src="./src/assets/images/triangleDown.svg"
            alt="open resource options"
          />
        </button>
      )}
    </li>
  ));

  return (
    <div className={styles.outerContainer}>
      <div className={`${styles.container} opacity-5x`}>
        {/* prop */}
        <h2 className={styles.fluidity}>{text}</h2>
        <div className={styles.navbarFixed}>
          <div className={styles.fixed}>
            <div>
              <a href={"/"}>
                {/* prop */}
                <img src={logo} alt="home page" />
              </a>
            </div>
            {/* props */}
            <GeneralButton
              version={button.version}
              type={button.type}
              size={button.size}
              handleClick={button.handleClick}
            >
              {button.children}
            </GeneralButton>
          </div>
        </div>
        <div className={styles.navbar}>
          <div className={styles.fade}>
            <nav>
              <ul>{navLinksTitles as ReactNode}</ul>
            </nav>
            {modal && (
              <NavBarModal handleModal={handleModal} navLinks={links} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;

const links: ILinkButton[] = [
  {
    children: "articles",
    size: "small",
    type: "internal",
    handleClick: () => {},
  },
  {
    children: "fluniversity",
    size: "small",
    type: "internal",
    handleClick: () => {},
  },
  {
    children: "whitpapers",
    size: "small",
    type: "internal",
    handleClick: () => {},
  },
  {
    children: "documentation",
    size: "small",
    type: "external",
    handleClick: () => {},
  },
];
