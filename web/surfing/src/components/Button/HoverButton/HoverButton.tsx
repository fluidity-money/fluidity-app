// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import type { ButtonHTMLAttributes } from "react";

import { useState } from "react"
import { InfoCircle, Card } from "components";
import styles from "./HoverButton.module.scss";

interface IHoverButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  children: string;
  size: "small" | "medium" | "large";
  color?: "white" | "gray";
  hoverComp: React.ReactNode;
}

const HoverButton = ({
  children,
  size,
  color = "white",
  className,
  hoverComp,
  ...props
}: IHoverButtonProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const classProps = className || "";

  const buttonColorProps = styles[color];
  const buttonClassProps = `${
    styles.button
  } ${buttonColorProps} ${classProps}`;

  const textSizeProps = styles[size];
  const textClassProps = `${styles.text} ${textSizeProps}`;

  return (
    <div style={{display: "block"}}>
    <button
      className={buttonClassProps}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(true)}
      {...props}
    >
      <div className={textClassProps}>{children}</div>
      <InfoCircle className={`${styles.icon} ${classProps}`} />
    </button>
    {(isHovered || isFocused) && (
      <Card rounded className={styles.hoverContainer}>
        {hoverComp}
      </Card>
    )}
  </div>
  );
};

export default HoverButton;
