// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE.md file.

import styles from "./Display.module.scss";

type DisplayProps = {
  children: React.ReactNode;
  xxs?: boolean
  extraSmall?: boolean
  small?: boolean
  medium?: boolean
  large?: boolean
  color?: "white" | "gray";
  center?: boolean;
  noMarginBottom?: boolean;

  [key: string]: any
};

const Display =
  ({
    children,
    large = true,
    center,
    color="white",
    noMarginBottom,
    ...props }: DisplayProps
  ) => {
    const sizeMap = {
      "xxs": "xxs",
      "extraSmall": "xs",
      "small": "sm",
      "medium": "md",
    };

    const size = Object.entries(sizeMap).reduce((acc, [key, value]) => {
      if (props[key]) {
        return value;
      }
      return acc;
    }, "lg"); // Large is default if no size is specified.

    const propClasses = props.className || "";

    const { extraSmall, small, medium, large: _, ...rest } = props;

    const centerProp = center ? styles.center : "";

    const noMarginBottomProp = noMarginBottom ? styles.noMarginBottom : "";
    
    const sizeProps = styles[size];

    const colorProps = styles[color];

    const className =
      ` ${styles.display} ${sizeProps} ${colorProps} ${centerProp} ${noMarginBottomProp} ${propClasses}`;

    return <h1 {...rest} className={className}>
      {children}
    </h1>
  };

export default Display;
