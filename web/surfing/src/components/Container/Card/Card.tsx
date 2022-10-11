// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import styles from './Card.module.scss';

interface ICard {
  component?: "div" | "button" | "tr";
  rounded?: boolean;
  type?: "gray" | "box" | "holobox" | "transparent";
  [_: string]: any;
}

const Card = ({component, rounded, className, children, type, ...props}: ICard) => {
  const classProps = className || "";
  const Component = component || "div";

  const typeClass = styles[type || "gray"];
  
  return (
    <Component className={`${styles.card} ${typeClass} ${rounded && styles.rounded} ${classProps}`} {...props}>
      {children}
    </Component>
  )
}

export default Card;

