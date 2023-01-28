// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import BurgerMenu from "components/BurgerMenu";
import MobileNavModal from "modals/MobileNavModal";
import Link from "next/link";
import { useState } from "react";
import styles from "./MobileNavBar.module.scss";

const MobileNavBar = () => {
  const [open, setIsOpen] = useState(false);

  return (
    <div className={styles.container}>
      <div className={`${styles.nav} opacity-5x`}>
        <Link href={"/"} passHref>
          <a className={open ? styles.hidden : styles.fluidity} href={"/"}>
            <img src="/assets/images/textLogo.svg" alt="home page" />
          </a>
        </Link>

        <BurgerMenu isOpen={open} setIsOpen={setIsOpen} />
      </div>
      {open && (
        <MobileNavModal
          navLinks={["How it works", "Resources"]}
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  );
};

export default MobileNavBar;
