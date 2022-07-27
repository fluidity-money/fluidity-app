import React from "react";
import TextButton from "../Button";
import styles from "./NavBar.module.scss";

const NavBar = () => {
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
                <button />
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
