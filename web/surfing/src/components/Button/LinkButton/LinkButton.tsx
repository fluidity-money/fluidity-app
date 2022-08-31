// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import type { ButtonHTMLAttributes } from "react";

import { ReactComponent as ArrowRight } from "/src/assets/images/buttonIcons/arrowRightWhite.svg";
import { ReactComponent as ArrowTopRight } from "/src/assets/images/buttonIcons/arrowTopRightWhite.svg";
import styles from "./LinkButton.module.scss";

interface ILinkButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
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
  className,
  ...props
}: ILinkButtonProps) => {
  const classProps = className || "";

  return (
    <button 
      className={`${styles.button} ${classProps}`}
      onClick={handleClick} 
      {...props}
    >
      <div className={`${styles.text} ${styles[size]}`}>
        {children}
      </div>
      {
        type === "internal"
          ? <ArrowRight className={`${styles.icon} ${classProps}`} />
          : <ArrowTopRight className={`${styles.icon} ${classProps}`} />
      }
    </button>
  );
};

export default LinkButton;
