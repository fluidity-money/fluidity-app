// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { motion } from "framer-motion";
import useScrollDirection from "hooks/useScrollDirection";
import useViewport from "hooks/useViewport";
import { useState } from "react";
import { GeneralButton, NavBarModal } from "@fluidity-money/surfing";
import styles from "./NavBar.module.scss";

const NavBar = () => {
  const [modal, setModal] = useState(false);

  const handleModal = () => {
    setModal(modal => !modal);
  };

  const { width } = useViewport();
  const breakpoint = 700;

  const { scrollDir } = useScrollDirection();
  const scrollVariants = {
    appear: { y: 0 },
    disappear: { y: -100 },
  };

  return (
    <div className={styles.outerContainer}>
      <div className={`${styles.container} opacity-5x`}>
        <motion.h2
          className={styles.fluidity}
          variants={scrollVariants}
          animate={scrollDir === "up" ? "appear" : "disappear"}
          transition={{ type: "tween" }}
        >
          fluidity
        </motion.h2>
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
              size={width < breakpoint ? "small" : "medium"}
              handleClick={() => {}}
            >
              LAUNCH FLUIDITY
            </GeneralButton>
          </div>
        </div>
        <motion.div
          className={styles.navbar}
          variants={scrollVariants}
          animate={scrollDir === "up" ? "appear" : "disappear"}
          transition={{ type: "tween" }}
        >
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
                {/* <li>
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
                </li> */}
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
            {modal && (
              <NavBarModal handleModal={handleModal} navLinks={links} />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NavBar;

interface ILinkButton {
  children: string;
  size: "small" | "medium" | "large";
  type: "internal" | "external";
  handleClick: () => void;
}

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
