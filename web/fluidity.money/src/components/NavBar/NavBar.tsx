// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { motion } from "framer-motion";
import useScrollDirection from "hooks/useScrollDirection";
import { useState } from "react";
import {
  ArrowRight,
  ArrowTopRight,
  Text,
  useViewport,
} from "@fluidity-money/surfing";
import styles from "./NavBar.module.scss";
import { LaunchButton } from "components/Button";
import Link from "next/link";

const navLinks = [
  {
    title: 'HOW IT WORKS',
    href: '/howitworks',
    icon: <ArrowRight />
  },
  {
    title: 'ECOSYSTEM',
    href: '/ecosystem',
    icon: <ArrowRight />
  },
  {
    title: 'FLUID STATS',
    href: '/fluidstats',
    icon: <ArrowRight />
  },
  {
    title: 'RESOURCES',
    href: '/resources',
    icon: <ArrowTopRight />
  }
]

const NavBar = () => {
  const [modal, setModal] = useState(false);

  const { width } = useViewport();
  const breakpoint = 700;

  const { scrollDir } = useScrollDirection();
  const scrollVariants = {
    appear: { y: 0 },
    disappear: { y: -100 },
  };

  return (
    <header className={styles.outerContainer}>
      <motion.div
        className={styles.fluidity}
        variants={scrollVariants}
        animate={scrollDir === "up" ? "appear" : "disappear"}
        transition={{ type: "tween" }}
      >
        <Link href={"/"} passHref>
          <a>
            <img src="/assets/images/textLogo.svg" alt="home page" />
          </a>
        </Link>
      </motion.div>
      <div className={styles.navbarFixed}>
        <motion.div
          variants={scrollVariants}
          initial={{ y: -100 }}
          animate={scrollDir === "up" ? "disappear" : "appear"}
          transition={{ type: "tween" }}
        >
          <Link href={"/"} passHref>
            <a>
              <div className={styles.imgContainer}>
                <img src="/assets/images/logoOutline.png" alt="home page" />
              </div>
            </a>
          </Link>
        </motion.div>
        <motion.nav
          className={styles.navbar}
          variants={scrollVariants}
          animate={scrollDir === "up" ? "appear" : "disappear"}
          transition={{ type: "tween" }}
        >
          {
            navLinks.map((link, i) => {
              return <Link href={link.href} key={`navlink-${i}`}>
                <a>
                  <Text code prominent size="xs">{link.title}</Text>
                  {link.icon}
                </a>
              </Link>
            })
          }
        </motion.nav>
        <LaunchButton
          version={"primary"}
          type={"text"}
          size={width < breakpoint && width > 0 ? "small" : "medium"}
        >
          LAUNCH FLUIDITY
        </LaunchButton>
      </div>
    </header>
  );
};

export default NavBar;
