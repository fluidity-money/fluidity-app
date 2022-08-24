// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import Toolbar from "components/Toolbar";
import { FluidityToolBarTheme as ToolbarContents } from "components/Toolbar/ToolbarContents/FluidityToolBarTheme";
import AppContainer from "components/Styling/AppContainer";
import AppBody from "components/Styling/AppBody";
import Header from "components/Header"

const RouteNotFound = () => {
    return (
        <AppContainer>
            <Toolbar>
                <ToolbarContents
                    selected={
                        { options: [false, false, false] }
                    } />
            </Toolbar>
            <AppBody direction="align p-1" alignment="space-between">
                <div className="rnf-container">
                    <Header children="404" type="primary" className="rnf-header" />
                    <Header children="We can't find that page sorry!" type="primary" className="rnf-text" />

                </div>
            </AppBody>
        </AppContainer>
    );
}

export default RouteNotFound;