// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import type { IGeneralButtonProps } from "../Button/GeneralButton/GeneralButton";

import { ReactNode, useState } from "react";
import { GeneralButton, NavBarModal } from "~/components";
import styles from "./NavBar.module.scss";
import useViewport from "~/util/hooks/useViewport";

interface INavLinks {
  name: string;
  modal: boolean;
  modalInfo?: IModalProps;
}

interface INavBarProps {
  logo: string;
  text: string;
  button: IGeneralButtonProps;
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

  const { width } = useViewport();
  const breakpoint = 700;

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
        <button onClick={() => {}}>
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
              buttonType={"text"}
              size={width < breakpoint ? "small" : "medium"}
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
