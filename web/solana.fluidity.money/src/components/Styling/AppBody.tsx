// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

const AppBody = ({
    direction,
    alignment,
    children
}: {
    direction: string;
    alignment: string;
    children: JSX.Element | JSX.Element[]
}) => {
    return <div className={`${direction} flex-${alignment} app-body`}>
        {children}
    </div>
}

export default AppBody;