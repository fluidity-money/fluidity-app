// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import Toolbar, { WalletToolbar } from "components/Toolbar";
import { FluidityToolBarTheme as ToolbarContents } from "components/Toolbar/ToolbarContents/FluidityToolBarTheme";
import AppContainer from "components/Styling/AppContainer";
import { WalletToolbarContent as ToolbarContent } from "components/Toolbar/ToolbarContents/WalletToolbarContent";
import SendFluid from "./Contents/WalletPage/SendFluid";
import TransactionHistory from "./Contents/WalletPage/TransactionHistory";
import Header from "components/Header";
import Routes from "util/api/types";


type walletSend = {
  myHistory: Routes['/my-history']
};

const WalletSend = ({ myHistory } : walletSend) => {
  const filteredSends = myHistory.filter(action => action.type == "send");

  return (
    <AppContainer>
      <Toolbar>
        <ToolbarContents
          selected={
            { options: [false, false, true] }
          } />
      </Toolbar>

      <div className="wallet-body">
        <WalletToolbar>
          <ToolbarContent
            selected={
              { options: [false, true, false] }
            }
          />
        </WalletToolbar>
        <div className="w-header-container">
          <Header type="primary" className="wallet-header">Send Fluid Dollars</Header>
        </div>
        <SendFluid></SendFluid>
        <div className="w-header-container">
          <Header type="primary" className="wallet-header">Send History</Header>
        </div>
        <TransactionHistory myHistory={filteredSends}/>
      </div>
    </AppContainer>
  );
};

export default WalletSend;
