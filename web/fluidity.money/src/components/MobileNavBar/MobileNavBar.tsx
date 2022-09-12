// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import BurgerMenu from "components/BurgerMenu";
import MobileNavModal from "modals/MobileNavModal";
import { useState } from "react";
import styles from "./MobileNavBar.module.scss";

const MobileNavBar = () => {
  const [open, setIsOpen] = useState(false);

  return (
    <div className={styles.container}>
      <div className={`${styles.nav} opacity-5x`}>
        <a className={open ? styles.hidden : styles.fluidity} href={"/"}>
          <img src="/assets/images/textLogo.svg" alt="home page" />
        </a>

        <BurgerMenu isOpen={open} setIsOpen={setIsOpen} />
      </div>
      {open && <MobileNavModal navLinks={["How it works", "Resources"]} />}
    </div>
  );
};

export default MobileNavBar;
