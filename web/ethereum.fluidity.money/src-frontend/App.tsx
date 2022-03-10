import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SwapPage from "./components/Pages/Swap";
import Dashboard from "./components/Pages/Dashboard";
import Wallet from "./components/Pages/Wallet";
import WalletSend from "./components/Pages/WalletSend";
import WalletHistory from "./components/Pages/WalletHistory";
import { Connectors, UseWalletProvider } from 'use-wallet'
import { InjectedConnector } from "@web3-react/injected-connector";
import AppUpdater from './components/Updaters/AppUpdater';
import { LoadingStatus, LoadingStatusToggle } from "components/context";
import { useState } from "react";
import LoadingStatusModal from "components/Modal/Themes/LoadingStatusModal";
import RouteNotFound from "components/Pages/RouteNotFound";
import ProtectedRoute from "components/Routes/ProtectedRoute";
import { isChrome, isFirefox, isEdge, isChromium } from 'react-device-detect';
import Unsupported from "./components/Pages/Unsupported";
import TransactionConfirmationModal from "components/Modal/Themes/TransactionConfirmationModal.tsx";
import ConfettiAnimation from "components/NotificationAlert/confettiAnimation";
import NotificationAlert from "components/NotificationAlert";
import { Routes, WebsocketMessage } from "util/api/types";
import useWebSocket from "react-use-websocket";
import { formatAmount } from "util/amounts";
import NotificationContainer from "components/Notifications/NotificationContainer";
import ApiStateHandler, {ApiState} from "components/ApiStateHandler";
import { root_websocket } from "util/api";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

const App = () => {
  Sentry.init({
    dsn: "https://02225ae4a93c4b438998f8f56041566b@o1103433.ingest.sentry.io/6130103",
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  });

  const chainId_ = process.env.REACT_APP_CHAIN_ID;

  if (!chainId_) {
    console.error("REACT_APP_CHAIN_ID not set!");
    process.exit(1);
  }

  const chainId = Number(chainId_);

  const providerOptions: Connectors = {
    injected: new InjectedConnector({ supportedChainIds: [chainId] }),
    walletconnect: {
      rpcUrl: process.env.REACT_APP_WALLET_CONNECT_GETH_URI || ""
    }
  };

  /* ### Base State for API context ### */
  // Toggle state for notification win
  const [winAlert, setWinAlert] = useState<boolean>(false);

  const [notificationMessage, setNotificationMessage] = useState<string>("");

  const [pastWinnings, setPastWinnings] = useState<Routes['/past-winnings']>([]);

  // Toggle state for prize board status
  const [prizeBoard, setPrizeBoard] = useState<Routes['/prize-board']>([]);

  // Toggle state for reward pool status
  const [rewardPool, setPrizePool] = useState<Routes['/prize-pool']>({
    network: "",
    contract_address: "",
    amount: "",
    last_updated: "",
  });

  // Toggle state for user action history
  const [userActions, setUserActions] = useState<Routes['/my-history']>([]);

  const [notificationTrigger, setNotificationTrigger] = useState<boolean>(false);

  // Toggle context setup for loading status modal toggle from anywhere in the
  // application for waiting periods
  const [loadingToggler, setLoadingToggler] = useState<boolean>(false);

  const loadingModalToggle = (state: boolean) => {
    setLoadingToggler(state);
  }

  const [messageData, setMessageData] = useState<WebsocketMessage>({});

  const {lastJsonMessage} = useWebSocket(root_websocket);

  const loadingToggleProps: LoadingStatus = {
    toggle: [loadingToggler, loadingModalToggle]
  }

  /* browser detection. if user isn't using firefox or chromium based browser
  then render a message telling them to change browser, else render the app */
  if (!isChrome && !isFirefox && !isEdge && !isChromium)
    return <Unsupported />;

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
    lastJsonMessage
  };

  return (
    // React router provider
    <Router>
      {/* useWallet Hook Provider */}
      <UseWalletProvider
        chainId={chainId}
        connectors={providerOptions}
      >
        {/* Loading Status context toggle provider */}
        <LoadingStatusToggle.Provider value={loadingToggleProps}>
          {/* Loads specifically one route at a time */}
          <NotificationContainer>
          {/* Renders App triggers on load (such as auto logging into wallet) */}
          <AppUpdater />
          <ApiStateHandler state={apiState}/>
          <Switch>
            <Route
              path="/"
              exact
              render={props =>
                <SwapPage prizeBoard={prizeBoard} {...props} />
              } />

            <Route
              path="/dashboard" exact
              render={props =>
                <Dashboard
                  pastWinnings={pastWinnings}
                  prizeBoard={prizeBoard}
                  rewardPool={rewardPool}
                  {...props} />} />

            <ProtectedRoute
              exact={true}
              path="/wallet"
              component={Wallet}
              extraProps={{
                rewardPool: rewardPool,
                prizeBoard: prizeBoard
              }} />

            <ProtectedRoute
              exact={true}
              path="/walletsend"
              component={WalletSend}
              extraProps={{
                myHistory: userActions
              }} />

            <ProtectedRoute
              exact={true}
              path="/wallethistory"
              component={WalletHistory}
              extraProps={{
                myHistory: userActions
              }} />

            <Route component={RouteNotFound} />
          </Switch>
          {/* Loading modal for transactions */}
          <LoadingStatusModal enable={loadingToggler} />
          {/* Notification alert component to notifiy the user of a successful rewardpool win globally */}
          <NotificationAlert
            enable={notificationTrigger}
            setEnable={() => setNotificationTrigger(!notificationTrigger)}
            active={document.hidden}
            message={
              `You have won ${formatAmount(notificationMessage) } fUSDT!`}
          />
          <ConfettiAnimation trigger={winAlert} />

          <TransactionConfirmationModal
            enable={winAlert}
            toggle={() => setWinAlert(!winAlert)}
            message={
              [<div>🎉🎉<span className="primary-text">  CONGRATS  </span>🎉🎉</div>,
              <div className="secondary-text">
                You have won { formatAmount(notificationMessage) } fUSDT!
              </div>]
            }
          />
          </NotificationContainer>
        </LoadingStatusToggle.Provider>
      </UseWalletProvider>
    </Router>
  );
}

export default App;
