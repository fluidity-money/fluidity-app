// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SwapPage from "./components/Pages/Swap";
import Dashboard from "./components/Pages/Dashboard";
import Wallet from "./components/Pages/Wallet";
import WalletSend from "./components/Pages/WalletSend";
import WalletHistory from "./components/Pages/WalletHistory";
import { Connectors, UseWalletProvider } from "use-wallet";
import { InjectedConnector } from "@web3-react/injected-connector";
import AppUpdater from "./components/Updaters/AppUpdater";
import { useState } from "react";
import RouteNotFound from "components/Pages/RouteNotFound";
import ProtectedRoute from "components/Routes/ProtectedRoute";
import { isChrome, isFirefox, isEdge, isChromium } from "react-device-detect";
import Unsupported from "./components/Pages/Unsupported";
import TransactionConfirmationModal from "components/Modal/Themes/TransactionConfirmationModal.tsx";
import ConfettiAnimation from "components/NotificationAlert/confettiAnimation";
import NotificationAlert from "components/NotificationAlert";
import { Routes, WebsocketMessage } from "util/api/types";
import useWebSocket from "react-use-websocket";
import NotificationContainer from "components/Notifications/NotificationContainer";
import ApiStateHandler, { ApiState } from "components/ApiStateHandler";
import { root_websocket } from "util/api";
import {
  TokenListContext,
  tokenListContext,
  userActionContext,
} from "components/context";
import ErrorBoundary from "components/Errors/ErrorBoundary";
import { chainIdFromEnv } from "util/chainId";
import { appTheme } from "util/appTheme";
import useLocalStorage from "util/hooks/useLocalStorage";
import { tokenData } from "util/tokenData";

const App = () => {
  const chainId = chainIdFromEnv();

  const providerOptions: Connectors = {
    injected: new InjectedConnector({ supportedChainIds: [chainId] }),
    walletconnect: {
      rpcUrl: process.env.REACT_APP_WALLET_CONNECT_GETH_URI || "",
    },
  };

  /* ### Base State for API context ### */
  // Toggle state for notification win
  const [winAlert, setWinAlert] = useState<boolean>(false);

  const [notificationMessage, setNotificationMessage] = useState<string>("");

  const [pastWinnings, setPastWinnings] = useState<Routes["/past-winnings"]>(
    []
  );

  // Toggle state for prize board status
  const [prizeBoard, setPrizeBoard] = useState<Routes["/prize-board"]>([]);

  // Toggle state for reward pool status
  const [rewardPool, setPrizePool] = useState<Routes["/prize-pool"]>({
    contract_address: "",
    amount: "",
    last_updated: "",
  });

  // Toggle state for user action history
  const [userActions, setUserActions] = useState<Routes["/my-history"]>([]);

  const [notificationTrigger, setNotificationTrigger] = useState(false);

  const [messageData, setMessageData] = useState<WebsocketMessage>({});

  const [pendingWins, setPendingWins] = useState<Routes["/pending-rewards"]>({});

  const { lastJsonMessage } = useWebSocket(root_websocket);

  /* using local storage hook to persist for pinned tokens for 
  fluid and non-fluid states used in token select modal */
  const [pinnedTokens, setPinnedTokens] = useLocalStorage(
    "pinned",
    [...tokenData].slice(0, tokenData.length / 2)
  );
  const [pinnedFluidTokens, setPinnedFluidTokens] = useLocalStorage(
    "pinned-fluid",
    [...tokenData].slice(tokenData.length / 2, tokenData.length)
  );
  const [tokens, setTokens] = useLocalStorage(
    "tokens",
    [...tokenData].slice(tokenData.length / 2, tokenData.length)
  );
  const [fluidTokens, setFluidTokens] = useLocalStorage(
    "fluid-tokens",
    [...tokenData].slice(tokenData.length / 2, tokenData.length)
  );

  /* browser detection. if user isn't using firefox or chromium based browser
  then render a message telling them to change browser, else render the app */
  if (!isChrome && !isFirefox && !isEdge && !isChromium) return <Unsupported />;

  // collated state to be handled in ApiStateHandler
  const apiState: ApiState = {
    setPastWinnings,
    setPrizeBoard,
    setPrizePool,
    userActions,
    setUserActions,
    prizeBoard,
    messageData,
    setMessageData,
    setWinAlert,
    setNotificationMessage,
    setNotificationTrigger,
    lastJsonMessage,
  };

  // token info for context for token select modal
  const tokenListInfo: TokenListContext = {
    pinnedTokens: pinnedTokens,
    setPinnedTokens: setPinnedTokens,
    pinnedFluidTokens: pinnedFluidTokens,
    setPinnedFluidTokens: setPinnedFluidTokens,
    tokens: tokens,
    setTokens: setTokens,
    fluidTokens: fluidTokens,
    setFluidTokens: setFluidTokens,
  };

  return (
    // React router provider
    <Router>
      {/* useWallet Hook Provider */}
      <UseWalletProvider chainId={chainId} connectors={providerOptions}>
        {/* Context for user actions recieved over WS, to support dynamic updates */}
        <userActionContext.Provider value={userActions}>
          <tokenListContext.Provider value={tokenListInfo}>
            {/* Loads specifically one route at a time */}
            <ErrorBoundary>
              <NotificationContainer>
                {/* Renders App triggers on load (such as auto logging into wallet) */}
                <AppUpdater />
                <ApiStateHandler state={apiState} />
                <Switch>
                  <Route
                    path="/"
                    exact
                    render={(props) => (
                      <SwapPage prizeBoard={prizeBoard} {...props} />
                    )}
                  />

                  <Route
                    path="/dashboard"
                    exact
                    render={(props) => (
                      <Dashboard
                        pastWinnings={pastWinnings}
                        prizeBoard={prizeBoard}
                        rewardPool={rewardPool}
                        {...props}
                      />
                    )}
                  />

                  <ProtectedRoute
                    exact={true}
                    path="/wallet"
                    component={Wallet}
                    extraProps={{
                      rewardPool: rewardPool,
                      prizeBoard: prizeBoard,
                    }}
                  />

                  <ProtectedRoute
                    exact={true}
                    path="/walletsend"
                    component={WalletSend}
                    extraProps={{
                      myHistory: userActions,
                    }}
                  />

                  <ProtectedRoute
                    exact={true}
                    path="/wallethistory"
                    component={WalletHistory}
                    extraProps={{
                      myHistory: userActions,
                    }}
                  />

                  <Route component={RouteNotFound} />
                </Switch>
                {/* Notification alert component to notifiy the user of a successful rewardpool win globally */}
                <NotificationAlert
                  enable={notificationTrigger}
                  setEnable={() => setNotificationTrigger(!notificationTrigger)}
                  active={document.hidden}
                  message={notificationMessage}
                />
                <ConfettiAnimation trigger={winAlert} />

                <TransactionConfirmationModal
                  enable={winAlert}
                  toggle={() => setWinAlert(!winAlert)}
                  message={[
                    <div key={"TCM1"}>
                      🎉🎉
                      <span className={`primary-text${appTheme}`}>
                        {" "}
                        CONGRATS{" "}
                      </span>
                      🎉🎉
                    </div>,
                    <div key={"TCM2"} className={`secondary-text${appTheme}`}>
                      {notificationMessage}
                    </div>,
                  ]}
                />
              </NotificationContainer>
            </ErrorBoundary>
          </tokenListContext.Provider>
        </userActionContext.Provider>
      </UseWalletProvider>
    </Router>
  );
};

export default App;
