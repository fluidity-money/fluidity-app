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
    <div className={styles.container}>
      <div className={styles.navbar}>
        <div className={styles.left}>
          <div>Logo</div>
          <div>Fluidity</div>
        </div>

        <div className={styles.right}>
          <nav>
            <ul>
              <li>
                <a href="/howitworks">How it works</a>
              </li>
              <li>
                <a href="/ecosystem">Ecosystem</a>
              </li>
              <li>
                <a href="/fluidstats">Fluid stats</a>
              </li>
              <li>
                <a href="/resources">Resources</a>
                {/* <button>v</button> */}
              </li>
            </ul>
          </nav>
          <TextButton colour="white">LAUNCH FLUIDITY</TextButton>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
