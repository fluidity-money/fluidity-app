// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import "./Heading.scss";

type Props = {
    children: React.ReactNode;
    as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

const Heading = ({ children, as, ...props }: Props & unknown) => {
    const Component = as || "h1";
    return <Component {...props}>
        {children}
    </Component>
};

export default Heading;