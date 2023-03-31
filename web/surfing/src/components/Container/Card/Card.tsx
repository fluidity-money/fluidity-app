// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import styles from "./Card.module.scss";

export interface ICard {
  component?: "div" | "button" | "tr"; 
  style?: React.CSSProperties;
  rounded?: boolean;
  disabled?: boolean;

  type?: "opaque" | "transparent" | "frosted"
  border?: "solid" | "dashed" | "none";
  color?: "gray" | "white" | "holo"
  
  [_: string]: any;
}

const Card = ({
  component="div",
  style = {},
  rounded=true,
  className="",
  disabled=false,
  children,
  type="opaque",
  border="none",
  color="gray",
  ...props
}: ICard) => {
  const Component = component;

  const typeClass = type !== 'opaque' ? styles[type] : '';
  const borderClass = styles[border];
  const colorClass = styles[color];
  const elementClass = component === 'button' ? styles[component] : '';
  const propsClass = className;

  const allClasses = `
    ${styles.card} 
    ${propsClass}
    ${elementClass} 
    ${rounded ? styles.rounded : ''} 
    ${typeClass} 
    ${borderClass}
    ${colorClass}
  `;

  return (
    <Component style={style} className={allClasses} disabled={disabled} {...props}>
      {children}
    </Component>
  );
};

export default Card;
