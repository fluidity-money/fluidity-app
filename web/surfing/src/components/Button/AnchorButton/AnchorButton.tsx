// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import type { ButtonHTMLAttributes } from "react";

import { ReactComponent as ArrowDown } from "/src/assets/images/buttonIcons/arrowDownWhite.svg";
import styles from "./AnchorButton.module.scss";

interface IAnchorButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const AnchorButton = ({ children, disabled, className, ...props }: IAnchorButtonProps) => {
  const classProp = className || "";

  return (
    <button className={`${styles.button} ${classProp}`} disabled={disabled} {...props} >
      <ArrowDown className={styles.icon} />{" "}
      <div className={styles.text}>{children}</div>
    </button>
  );
};

export default AnchorButton;
