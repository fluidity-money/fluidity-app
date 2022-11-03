// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import Toolbar, { WalletToolbar } from "components/Toolbar";
import { FluidityToolBarTheme as ToolbarContents } from "components/Toolbar/ToolbarContents/FluidityToolBarTheme";
import AppContainer from "components/Styling/AppContainer";
import { WalletToolbarContent as ToolbarContent } from "components/Toolbar/ToolbarContents/WalletToolbarContent";
import CurrencyBreakdown from "./Contents/WalletPage/CurrencyBreakdown";

const Wallet = () => {

  return (
    <AppContainer>
      <Toolbar>
        <ToolbarContents
          selected={
            { options: [false, false, true] }
          } />
      </Toolbar>
        
      <div className="wallet-body-overview">
        <WalletToolbar>
          <ToolbarContent
            selected={
              { options: [true, false, false] }
            }
          />
        </WalletToolbar>
        <CurrencyBreakdown></CurrencyBreakdown>
      </div>
    </AppContainer>
  );
};

export default Wallet;