// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import type { ButtonHTMLAttributes } from "react";

import { ReactComponent as ArrowDown } from "@assets/images/buttonIcons/arrowDownWhite.svg";
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
