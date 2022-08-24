// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import "./Display.scss";

type Props = {
    children: React.ReactNode;
    extraSmall?: boolean;
    small?: boolean;
    medium?: boolean;
    large?: boolean;

    [key: string]: any;
};

const Display = ({ children, ...props }: Props & unknown) => {
    const sizeMap = {
        "extraSmall": "xs",
        "small": "sm",
        "medium": "md",
        "large": "lg",
    };

    const size = Object.entries(sizeMap).reduce((acc, [key, value]) => {
        if (props[key]) {
            return value;
        }
        return acc;
    }, "lg"); // Large is default if no size is specified.

    const propClasses = props.className || "";

    const className = `${size} ${propClasses}`;
    return <h1 {...props } className={className} >
        {children}
    </h1>
};

export default Display;