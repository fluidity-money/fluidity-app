// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import type { HTMLProps } from "react";

import styles from "./Text.module.scss";

interface IText extends HTMLProps<HTMLParagraphElement> {
    as: "xxl" | "xl" | "lg" | "md" | "sm" | "xs";
    bold?: boolean;
    underline?: boolean;
    colour?: "default" | "disabled" | "white" | "black";
};

const Text = ({ children, className, as, colour, bold, underline, ...props }: IText) => {
    const classProps = {className} || "";
    const colourProp = styles[colour || "default"];
    const boldProp = bold ? styles.bold : "";
    const underlineProp = underline ? styles.underline : "";

    return (
      <p className={`${styles[as]} ${colourProp} ${boldProp} ${underlineProp} ${classProps}`} {...props}>
        {children}
      </p>
    );
};

export default Text;