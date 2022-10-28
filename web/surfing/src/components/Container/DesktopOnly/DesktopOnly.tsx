// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import type { HTMLProps } from "react";

import styles from "./DesktopOnly.module.scss";

const Row = ({
  children,
  className,
  ...props
}: HTMLProps<HTMLDivElement> ) => {
  const classProps = className || "";

  return (
    <div className={`${styles.desktop} ${classProps}`} {...props} >
      {children}
    </div>
  );
};

export default Row;
