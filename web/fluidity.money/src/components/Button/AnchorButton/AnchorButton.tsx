// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import React from "react";
import styles from "./AnchorButton.module.scss";

interface IAnchorButtonProps {
  children: string;
}

const AnchorButton = ({ children }: IAnchorButtonProps) => {
  return (
    <button className={styles.button}>
      <img
        className={styles.icon}
        src="/assets/images/buttonIcons/arrowDownWhite.svg"
        alt="anchor button"
      />{" "}
      <div className={styles.text}>{children.toUpperCase()}</div>
    </button>
  );
};

export default AnchorButton;
