import React, { useEffect, useState } from "react";
import { TextButton } from "../Button";
import styles from "./NavBar.module.scss";

const NavBar = () => {
  const [show, setShow] = useState(true);
  const controlNavbar = () => {
    if (window.screenY > 20) {
      setShow(false);
    } else setShow(true);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return window.removeEventListener("scroll", controlNavbar);
  }, []);

  return (
    <div className={`${styles.container} opacity-5x`}>
      <div className={styles.navbarFixed}>
        <div className={styles.fixed}>
          <div>
            <a href="/">Fluidity</a>
          </div>
          <TextButton colour="white">LAUNCH FLUIDITY</TextButton>
        </div>
      </div>
      <div className={styles.navbar}>
        <div className={styles.fade}>
          <nav>
            <ul>
              <li>
                <a href="/howitworks">HOW IT WORKS</a>
              </li>
              <li>
                <a href="/ecosystem">ECOSYSTEM</a>
              </li>
              <li>
                <a href="/fluidstats">FLUID STATS</a>
              </li>
              <li>
                <a href="/resources">RESOURCES</a>
                {/* <button>v</button> */}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
