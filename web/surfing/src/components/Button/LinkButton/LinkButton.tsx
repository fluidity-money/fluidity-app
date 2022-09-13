// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import type { ButtonHTMLAttributes } from "react";

import { ArrowRight, ArrowTopRight } from "components";
import styles from "./LinkButton.module.scss";

interface ILinkButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  children: string;
  size: "small" | "medium" | "large";
  type: "internal" | "external";
  color?: "white" | "gray";
  handleClick: () => void;
}

const LinkButton = ({
  children,
  size,
  type,
  handleClick,
  color = "white",
  className,
  ...props
}: ILinkButtonProps) => {
  const classProps = className || "";

  const buttonColorProps = styles[color];
  const buttonClassProps = `${styles.button} ${buttonColorProps} ${classProps}`
  
  const textSizeProps = styles[size];
  const textClassProps = `${styles.text} ${textSizeProps}`

  return (
    <button 
      className={buttonClassProps}
      onClick={handleClick} 
      {...props}
    >
      <div className={textClassProps}>
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
