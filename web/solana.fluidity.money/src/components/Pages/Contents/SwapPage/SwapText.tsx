// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import React from 'react';
import Header from 'components/Header';

const SwapText = () => {
    return (
        <div className="flex column flex-space-evenly swap-text-container">
            <Header className="swap-text-header" type="primary">Turn your stable<br/>coins into <div className="highlight">$FLUID</div></Header>
            <div className="secondary-text swap-text-secondary my-2-t">
                Fluid dollars reward the sender and receiver just for using them
            </div>
        </div>
    )
}

export default SwapText;
