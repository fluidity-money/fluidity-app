// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import styles from "./Card.module.scss";

export interface ICard {
  component?: "div" | "button" | "tr";
  style?: React.CSSProperties;
  rounded?: boolean;
  disabled?: boolean;
  type?: "gray" | "box" | "box-prominent" | "holo" | "holobox" | "transparent" | "frosted";
  fill?: boolean;
  shimmer?: boolean;
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
  fill = false,
  shimmer = false,
  ...props
}: ICard) => {
  const classProps = className || "";
  const Component = component || "div";

  const typeClass = styles[type || "gray"];

  const allClasses = `${styles.card} ${typeClass} ${
    rounded ? styles.rounded : ''
  } ${disabled ? styles.disabled : ''}
  ${fill ? styles.fill : ''} ${shimmer ? styles.shimmer : ''}
  ${classProps}`;

  const CardContent = (
    <Component style={style} className={allClasses} disabled={disabled} {...props}>
      {children}
    </Component>
  )

  if (shimmer) return <div className={`${styles.shimmerWrapper} ${rounded ? styles.rounded : ''} ${fill ? styles.fill : ''}`}>{CardContent}</div>

  return CardContent
};

export default Card;
