// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import type { HTMLProps } from "react";

import styles from "./Row.module.scss";

interface IRowProps extends HTMLProps<HTMLDivElement> {
  reverse?: boolean;
}

const Row = ({
  children,
  className,
  reverse,
  ...props
}: IRowProps ) => {
  const classProps = className || "";

  return (
    <div className={`${styles.row} ${reverse && styles.reverse} ${classProps}`} {...props} >
      {children}
    </div>
  );
};

export default Row;
