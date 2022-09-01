// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import React from "react";
import styles from "./LinkButton.module.scss";

interface ILinkButtonProps {
  children: string;
  size: "small" | "medium" | "large";
  type: "internal" | "external";
  handleClick: () => void;
}

const LinkButton = ({
  children,
  size,
  type,
  handleClick,
}: ILinkButtonProps) => {
  return (
    <button className={styles.button} onClick={handleClick}>
      <div className={`${styles.text} ${styles[size]}`}>
        {children.toUpperCase()}
      </div>
      <img
        className={styles.icon}
        src={
          type === "external"
            ? "/assets/images/buttonIcons/arrowTopRightWhite.svg"
            : "/assets/images/buttonIcons/arrowRightWhite.svg"
        }
        alt="link icon"
      />
    </button>
  );
};

export default LinkButton;
