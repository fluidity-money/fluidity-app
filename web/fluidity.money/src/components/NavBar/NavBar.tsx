// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { motion } from "framer-motion";
import useScrollDirection from "hooks/useScrollDirection";
import useViewport from "hooks/useViewport";
import { useState } from "react";
import { NavBarModal, Text, TriangleDown } from "@fluidity-money/surfing";
import styles from "./NavBar.module.scss";
import { LaunchButton } from "components/Button";
import Link from "next/link";

const NavBar = () => {
  const [modal, setModal] = useState(false);

  const handleModal = (show: boolean) => {
    setModal(show);
  };

  const { width } = useViewport();
  const breakpoint = 700;

  const { scrollDir } = useScrollDirection();
  const scrollVariants = {
    appear: { y: 0 },
    disappear: { y: -100 },
  };
  const windowObjDefined = typeof window !== 'undefined'

  return (
    <div className={styles.outerContainer}>
      <div className={`${styles.container} opacity-5x`}>
        <motion.div
          className={styles.fluidity}
          variants={scrollVariants}
          animate={scrollDir === "up" ? "appear" : "disappear"}
          transition={{ type: "tween" }}
        >
          <Link 
            href={"/"}
            passHref
          >
            <a href={"/"}>
              <img src="/assets/images/textLogo.svg" alt="home page" />
            </a>
          </Link>
        </motion.div>
        <div className={styles.navbarFixed}>
          <div className={styles.fixed}>
            <motion.div
              variants={scrollVariants}
              initial={{ y: -100 }}
              animate={scrollDir === "up" ? "disappear" : "appear"}
              transition={{ type: "tween" }}
            >
              <Link
                href={"/"}
                passHref
              >
                <a href={"/"}>
                  <div className={styles.imgContainer}>
                    <img src="/assets/images/logoOutline.png" alt="home page" />
                  </div>
                </a>
              </Link>
            </motion.div>
            <LaunchButton
              version={"secondary"}
              type={"text"}
              size={width < breakpoint && width > 0 ? "small" : "medium"}
            >
              LAUNCH FLUIDITY
            </LaunchButton>
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
                  <Link
                    href={"/howitworks"}
                    passHref
                  >
                    <a
                      className={
                        (windowObjDefined && window.location.pathname.toString() === "/howitworks")
                          ? styles.active
                          : ""
                      }
                      href={"/howitworks"}
                    >
                      <Text size="md" className={styles.transparent}>HOW IT WORKS</Text>
                    </a>
                  </Link>
                </li>
                {/* <li>
                  <a
                    href={"/ecosystem"}
                    className={
                      windowObjDefined && window.location.pathname.toString() === "/ecosystem"
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
                      windowObjDefined && window.location.pathname.toString() === "/fluidstats"
                        ? styles.active
                        : ""
                    }
                  >
                    FLUID STATS
                  </a>
                </li> */}
                <li>
                  <Link
                    href={"/resources"}
                    passHref
                  >
                    <a
                      href={"/resources"}
                      className={
                       (windowObjDefined && window.location.pathname.toString() === "/resources")
                          ? styles.active
                          : ""
                      }
                    >
                      <Text size="md" className={styles.transparent}>RESOURCES</Text>
                    </a>
                  </Link>

                  <button className={`${styles.modalButton} ${styles.transparent}`} onClick={() => handleModal(!modal)}>
                    <TriangleDown />
                  </button>
                </li>
              </ul>
            </nav>
            {modal && (
              <NavBarModal handleModal={() => handleModal(false)} navLinks={links} />
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
    children: "whitepapers",
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
