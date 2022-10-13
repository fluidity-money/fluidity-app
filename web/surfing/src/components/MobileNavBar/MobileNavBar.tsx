// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { useState } from "react";
import BurgerMenu from "../BurgerMenu";
import { MobileNavModal } from "../MobileNavModal";
import styles from "./MobileNavBar.module.scss";

const MobileNavBar = () => {
  const [open, setIsOpen] = useState(false);

  return (
    <div className={styles.container}>
      <div className={`${styles.nav} opacity-5x`}>
        <h2 className={open ? styles.hidden : styles.fluidity}>fluidity</h2>

        <BurgerMenu isOpen={open} setIsOpen={setIsOpen} />
      </div>
      {open && <MobileNavModal navLinks={["How it works", "Resources"]} />}
    </div>
  );
};

export default MobileNavBar;
