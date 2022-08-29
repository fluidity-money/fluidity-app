import React, { useState } from "react";
import { GeneralButton } from "../Button";
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
              <a href={"/"}>
                <img src="/assets/images/logoOutline.svg" alt="home page" />
              </a>
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
                  <a
                    href={"/howitworks"}
                    className={
                      window.location.pathname.toString() === "/howitworks"
                        ? styles.active
                        : ""
                    }
                  >
                    HOW IT WORKS
                  </a>
                </li>
                <li>
                  <a
                    href={"/ecosystem"}
                    className={
                      window.location.pathname.toString() === "/ecosystem"
                        ? styles.active
                        : ""
                    }
                  >
                    ECOSYSTEM
                  </a>
                </li>
                <li>
                  <a
                    href={"/fluidstats"}
                    className={
                      window.location.pathname.toString() === "/fluidstats"
                        ? styles.active
                        : ""
                    }
                  >
                    FLUID STATS
                  </a>
                </li>
                <li>
                  <a
                    href={"/resources"}
                    className={
                      window.location.pathname.toString() === "/resources"
                        ? styles.active
                        : ""
                    }
                  >
                    RESOURCES
                  </a>

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
