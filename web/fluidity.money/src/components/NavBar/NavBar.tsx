// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { AnimatePresence, motion } from "framer-motion";
import useScrollDirection from "hooks/useScrollDirection";
import { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowTopRight,
  CaretRight,
  NavBarModal,
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
    title: 'RESOURCES',
    href: '/resources',
    icon: <CaretRight style={{ transform: 'rotate(90deg)', width: 8, height: 8 }} />
  },
  {
    title: 'DUNE ANALYTICS',
    href: 'https://dune.com/neogeo/fluidity-arbitrum',
    icon: <ArrowTopRight />
  }
]

const NavBar = () => {
  const [modal, setModal] = useState(false);

  const handleModal = (show: boolean) => {
    setModal(show);
  };

  const { width } = useViewport();
  const breakpoint = 900;

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
      <motion.nav
        className={styles.navbar}
        variants={scrollVariants}
        animate={scrollDir === "up" ? "appear" : "disappear"}
        transition={{ type: "tween" }}
        style={{ x: '-50%' }}
      >
        {
          navLinks.map((link, i) => {
            return <Link
              href={link.href}
              key={`navlink-${i}`}
            >
              <a>
                <Text code prominent size="xs">{link.title}</Text>
                <span onClick={(e) => {
                  if (link.title !== 'RESOURCES') return
                  e.preventDefault()
                  handleModal(true)
                }
                }>{link.icon}</span>
              </a>
            </Link>
          })
        }
      </motion.nav>
      {modal && (
        <AnimatePresence>
          <NavBarModal
            handleModal={() => handleModal(false)}
            navLinks={links}
          />
        </AnimatePresence>
      )}
      <LaunchButton
        version={"primary"}
        type={"text"}
        size={width < breakpoint && width > 0 ? "small" : "medium"}
      >
        LAUNCH FLUIDITY
      </LaunchButton>
    </header>
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
    handleClick: () => { },
  },
  {
    children: "fluniversity",
    size: "small",
    type: "internal",
    handleClick: () => { },
  },
  {
    children: "whitepapers",
    size: "small",
    type: "internal",
    handleClick: () => { },
  },
  {
    children: "documentation",
    size: "small",
    type: "external",
    handleClick: () => { },
  },
];
