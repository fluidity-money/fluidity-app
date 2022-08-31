// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import React from 'react';

const Header = ({ children, size, type, align, style, className }: { children: React.ReactNode; size?: string; type: string; align?: string; style?: React.CSSProperties, className?: string }) => {
    return <div className={`header ${type}-text text-${align === undefined ? "left" : align} font-${size === undefined ? "1rem" : size} ${className ?? ""}`} style={style}>{children}</div>;
}

export default Header;
