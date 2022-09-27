// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import styles from "./Display.module.scss";

type DisplayProps = {
    children: React.ReactNode
    xxs?: boolean
    extraSmall?: boolean
    small?: boolean
    medium?: boolean
    large?: boolean
    color?: "white" | "gray";

    [key: string]: any
};

const Display = ({ children, large = true, color="white", ...props }: DisplayProps ) => {
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
    
    const sizeProps = styles[size];
    const colorProps = styles[color];
    const className = ` ${styles.display} ${sizeProps} ${colorProps} ${propClasses}`;

    return <h1 {...rest } className={className}>
        {children}
    </h1>
};

export default Display;