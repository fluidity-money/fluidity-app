// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import React from "react";
import Header from "components/Header";
import { appTheme } from "util/appTheme";

const SwapText = () => {
  return (
    <div className="flex column flex-space-evenly swap-text-container">
      <Header className="swap-text-header" type="primary">
        Turn your stable
      </Header>
      <Header className="swap-text-header" type="primary">
        coins into
      </Header>
      <Header className="swap-text-header" type="primary">
        $FLUID
      </Header>
      <div className={`secondary-text${appTheme} swap-text-secondary my-2-t`}>
        Fluid dollars reward the sender and receiver just for using them
      </div>
    </div>
  );
};

export default SwapText;
