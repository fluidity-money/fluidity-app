import Toolbar, { WalletToolbar } from "components/Toolbar";
import { FluidityToolBarTheme as ToolbarContents } from "components/Toolbar/ToolbarContents/FluidityToolBarTheme";
import AppContainer from "components/Styling/AppContainer";
import { WalletToolbarContent as ToolbarContent } from "components/Toolbar/ToolbarContents/WalletToolbarContent";
import TransactionHistory from "./Contents/WalletPage/TransactionHistory";
import Header from "components/Header";
import Routes from "util/api/types";

type walletHistory = {
  myHistory: Routes['/my-history']
};

const WalletHistory = ({ myHistory } : walletHistory) => {

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
              { options: [false, false, true] }
            }
          />
        </WalletToolbar>
        <div className="w-header-container">
          <Header type="primary" className="wallet-header">
            Transaction History
          </Header>
        </div>
        <TransactionHistory myHistory={myHistory} />
      </div>
    </AppContainer>
  );
};

export default WalletHistory;
