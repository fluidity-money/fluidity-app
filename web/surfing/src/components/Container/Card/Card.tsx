// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import styles from "./Card.module.scss";

export interface ICard {
  component?: "div" | "button" | "tr";
  style?: React.CSSProperties;
  rounded?: boolean;
  disabled?: boolean;
  type?: "gray" | "box" | "box-prominent" | "holobox" | "transparent" | "frosted";
  [_: string]: any;
}

const Card = ({
  component,
  style = {},
  rounded,
  className,
  disabled,
  children,
  type,
  ...props
}: ICard) => {
  const classProps = className || "";
  const Component = component || "div";

  const typeClass = styles[type || "gray"];

  const allClasses = `${styles.card} ${typeClass} ${
    rounded && styles.rounded
  } ${disabled && styles.disabled} ${classProps}`;

  return (
    <Component style={style} className={allClasses} disabled={disabled} {...props}>
      {children}
    </Component>
  );
};

export default Card;
