// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import type { ButtonHTMLAttributes } from "react";

import { ArrowLeft, ArrowRight, ArrowTopRight, ArrowTopRightRed, InfoCircle } from "components";
import styles from "./LinkButton.module.scss";

interface ILinkButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  children: string;
  size: "small" | "medium" | "large";
  type: "internal" | "external" | "info";
  color?: "white" | "gray" | "red";
  left?: boolean;
  handleClick: () => void;
}

const LinkButton = ({
  children,
  size,
  type,
  handleClick,
  color = "white",
  left = false,
  className,
  ...props
}: ILinkButtonProps) => {
  const classProps = className || "";

  const buttonColorProps = styles[color];
  const buttonClassProps = `${styles.button
    } ${buttonColorProps} ${classProps} ${left && styles.iconLeft}`;

  const textSizeProps = styles[size];
  const textClassProps = `${styles.text} ${textSizeProps}`;

  return (
    <button className={buttonClassProps} onClick={handleClick} {...props}>
      <div className={textClassProps}>{children}</div>
      {type === "internal" && left === false ? (
        <ArrowRight className={`${styles.icon} ${classProps}`} />
      ) : type === "internal" && left === true ? (
        <ArrowLeft className={`${styles.icon} ${classProps}`} />
      ) : type === "info" ? (
        <InfoCircle className={`${styles.icon} ${classProps}`} />
      ) : color === 'red' ?
        (
          <ArrowTopRightRed className={`${styles.icon} ${classProps}`} />
        ) :
        (
          <ArrowTopRight className={`${styles.icon} ${classProps}`} />
        )}
    </button>
  );
};

export default LinkButton;
