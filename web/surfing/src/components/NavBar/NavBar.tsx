// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import type { IGeneralButtonProps } from "../Button/GeneralButton/GeneralButton";

import { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { GeneralButton } from "../Button";
import styles from "./NavBar.module.scss";

interface INavLinks {
  name: string;
  modal: boolean;
}

interface INavBarProps {
  logo: string;
  text: string;
  button: IGeneralButtonProps;
  navLinks: INavLinks[];
}

const NavBar = ({ logo, text, button, navLinks }: INavBarProps) => {
  const navLinksTitles = navLinks.map((link) => {
    <li>
      <NavLink
        to={`/${link.name.replace(/\s+/g, "")}`}
        className={({ isActive }) => {
          return isActive ? styles.active : "";
        }}
      >
        {link.name.toUpperCase()}
      </NavLink>
      {link.modal && (
        <button onClick={() => {}}>
          <img
            src="/assets/images/triangleDown.svg"
            alt="open resource options"
          />
        </button>
      )}
    </li>;
  });

  return (
    <div className={styles.outerContainer}>
      <div className={`${styles.container} opacity-5x`}>
        {/* prop */}
        <h2 className={styles.fluidity}>{text}</h2>
        <div className={styles.navbarFixed}>
          <div className={styles.fixed}>
            <div>
              <Link to={"/"}>
                {/* prop */}
                <img src={logo} alt="home page" />
              </Link>
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
            {/**{modal && <ResourcesNavModal handleModal={handleModal} />}*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
