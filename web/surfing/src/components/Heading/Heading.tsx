// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import styles from "./Heading.module.scss";

type Props = {
    children: React.ReactNode;
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    className?: string;
};

const Heading = ({ children, as="h1", className, ...props }: Props & unknown) => {
    const Component = as || "h1";
    const _className = `${styles[as]} ${className || ""}`;

    return <Component {...props} className={_className}>
        {children}
    </Component>
};

export default Heading;