// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import styles from "./Heading.module.scss";

type Props = {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  color?: "white" | "gray" | "black" | "hollow";
};

const Heading = ({
  children,
  as = "h1",
  className,
  color = "white",
  ...props
}: Props & unknown) => {
  const Component = as || "h1";

  const _className = `${styles[as]} ${styles[color]} ${className || ""}`;

  return (
    <Component {...props} className={_className}>
      {children}
    </Component>
  );
};

export default Heading;
