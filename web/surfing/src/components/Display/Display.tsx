// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import styles from "./Display.module.scss";

type DisplayProps = {
  children: React.ReactNode;
  size?: "xxxs" | "xxs" | "xs" | "sm" | "md" | "lg";
  color?: "white" | "gray";

  [key: string]: any;
};

const Display = ({
  children,
  size = "lg",
  color = "white",
  ...props
}: DisplayProps) => {
  const propClasses = props.className || "";

  const { extraSmall, small, medium, large: _, ...rest } = props;

  const sizeProps = styles[size];
  const colorProps = styles[color];
  const className = ` ${styles.display} ${sizeProps} ${colorProps} ${propClasses}`;

  return (
    <h1 {...rest} className={className}>
      {children}
    </h1>
  );
};

export default Display;
