// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import type { ButtonHTMLAttributes } from "react";

import styles from "./GeneralButton.module.scss";

export interface IGeneralButton {
  type?: "primary" | "secondary" | "transparent";
  size?: "small" | "medium" | "large";
  handleClick?: () => void;
  children?: React.ReactNode | null;
  icon?: React.ReactNode;
  layout?: "before" | "after";
  disabled?: boolean;
  className?: string;
  [key: string]: any;
}

const GeneralButton: React.FC<IGeneralButton> = ({
  children=null,
  icon=null,
  type="primary",
  size="medium",
  handleClick,
  disabled=false,
  className="",
  layout="before",
  ...props
}) => {

  const classProps = `
    ${styles.GeneralButton}
    ${styles[layout]} 
    ${styles[type]} 
    ${styles[size]}
    ${className}
  `;

  return (
    <button
      onClick={handleClick}
      className={classProps}
      disabled={disabled}
      {...props}
    >
      {icon && <div className={styles.icon}>{icon}</div>}
      {children && <div className={styles.text}>{children}</div>}
    </button>
  );
};

export default GeneralButton;
