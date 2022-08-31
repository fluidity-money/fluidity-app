// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { GeneralButton } from "surfing";
import ResourcesNavModal from "../../modals/ResourcesNavModal";
import styles from "./NavBar.module.scss";

const NavBar = () => {
  const [modal, setModal] = useState(false);
  const handleModal = () => {
    setModal(!modal);
  };
  return (
    <div className={styles.outerContainer}>
      <div className={`${styles.container} opacity-5x`}>
        <h2 className={styles.fluidity}>fluidity</h2>
        <div className={styles.navbarFixed}>
          <div className={styles.fixed}>
            <div>
              <Link to={"/"}>
                <img src="/assets/images/logoOutline.svg" alt="home page" />
              </Link>
            </div>
            <GeneralButton
              version={"secondary"}
              type={"text"}
              size={"medium"}
              handleClick={() => {}}
            >
              LAUNCH FLUIDITY
            </GeneralButton>
          </div>
        </div>
        <div className={styles.navbar}>
          <div className={styles.fade}>
            <nav>
              <ul>
                <li>
                  <NavLink
                    to={"/howitworks"}
                    className={({ isActive }) => {
                      return isActive ? styles.active : "";
                    }}
                  >
                    HOW IT WORKS
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={"/ecosystem"}
                    className={({ isActive }) => {
                      return isActive ? styles.active : "";
                    }}
                  >
                    ECOSYSTEM
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={"/fluidstats"}
                    className={({ isActive }) => {
                      return isActive ? styles.active : "";
                    }}
                  >
                    FLUID STATS
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={"/resources"}
                    className={({ isActive }) => {
                      return isActive ? styles.active : "";
                    }}
                  >
                    RESOURCES
                  </NavLink>

                  <button onClick={() => handleModal()}>
                    <img
                      src="/assets/images/triangleDown.svg"
                      alt="open resource options"
                    />
                  </button>
                </li>
              </ul>
            </nav>
            {modal && <ResourcesNavModal handleModal={handleModal} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
