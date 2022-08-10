import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { TextButton } from "../Button";
import ResourcesNavModal from "../ResourcesNavModal";
import styles from "./NavBar.module.scss";

const NavBar = () => {
  // whichever page is displayed should be underlined
  const [modal, setModal] = useState(false);
  const handleModal = () => {
    setModal(!modal);
  };
  return (
    <div className={`${styles.container} opacity-5x`}>
      <div className={styles.navbarFixed}>
        <div className={styles.fixed}>
          <div>
            <Link to={"/"}>Fluidity</Link>
          </div>
          <TextButton colour="white">LAUNCH FLUIDITY</TextButton>
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

                <button onClick={() => handleModal()}>v</button>
              </li>
            </ul>
          </nav>
          {modal && <ResourcesNavModal handleModal={handleModal} />}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
