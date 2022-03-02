import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SwapPage from "./components/Pages/Swap";
import Dashboard from "./components/Pages/Dashboard";
import Wallet from "./components/Pages/Wallet";
import WalletSend from "./components/Pages/WalletSend";
import WalletHistory from "./components/Pages/WalletHistory";
import { LoadingStatus, LoadingStatusToggle, userActionContext } from "components/context";
import {useState} from "react";
import LoadingStatusModal from "components/Modal/Themes/LoadingStatusModal";
import { SolanaProvider } from '@saberhq/use-solana';
import ProtectedRoute from "components/Routes/ProtectedRoute";
import RouteNotFound from "components/Pages/RouteNotFound";
import WinNotification from "components/WinNotification";
import NotificationContainer from "components/Notifications/NotificationContainer";
import { isChrome, isFirefox, isEdge, isChromium } from 'react-device-detect';
import Unsupported from "./components/Pages/Unsupported";
import ApiStateHandler, {ApiState} from "components/ApiStateHandler";
import Routes, {WebsocketMessage} from "util/api/types";
import TransactionConfirmationModal from "components/Modal/Themes/TransactionConfirmationModal.tsx";
import ConfettiAnimation from "components/NotificationAlert/confettiAnimation";
import * as Sentry from "@sentry/react";
import {Integrations} from "@sentry/tracing";
import NotificationAlert from "components/NotificationAlert";
import ErrorBoundary from "components/Errors/ErrorBoundary";

const App = () => {

  if (process.env.NODE_ENV === 'production') {
    const dsn = process.env.REACT_APP_SENTRY_DSN;
    if (!dsn) {
      throw new Error("REACT_APP_SENTRY_DSN not set!");
    }
      
    Sentry.init({
      dsn,
      integrations: [new Integrations.BrowserTracing()],
      tracesSampleRate: 1.0,
    });
  } else console.log("Running in development, ignoring Sentry initialisation...");

  // Toggle context setup for loading status modal toggle from anywhere in the application for waiting periods
  const [loadingToggler, setLoadingToggler] = useState<boolean>(false);
  const loadingModalToggle = (state: boolean) => {
    setLoadingToggler(state);
  }

  const loadingToggleProps: LoadingStatus = {
    toggle: [loadingToggler, loadingModalToggle]
  }
   /* ### Base State for API context ### */
  // Toggle state for notification win
  const [winAlert, setWinAlert] = useState<boolean>(false);
  const addWinNotification = (message: string) => {
    setNotificationMessage(message);
    setWinAlert(true);
  }

  const [notificationMessage, setNotificationMessage] = useState<string>("");

  const [pastWinnings, setPastWinnings] =
  useState<Routes['/past-winnings']>([]);

  // Toggle state for prize board status
  const [prizeBoard, setPrizeBoard] = useState<Routes['/prize-board']>([]);

  // Toggle state for reward pool status
  const [rewardPool, setPrizePool] = useState<Routes['/prize-pool']>({
    contract_address: "",
    amount: "",
    last_updated: "",
  });

  // Toggle state for user action history
  const [userActions, setUserActions] = useState<Routes['/my-history']>([]);

  const [notificationTrigger, setNotificationTrigger] =
  useState<boolean>(false);

  const [messageData, setMessageData] = useState<WebsocketMessage>({});

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
  };

  /* browser detection. if user isn't using firefox or chromium based browser
  then render a message telling them to change browser, else render the app */
  if (!isChrome && !isFirefox && !isEdge && !isChromium) return <Unsupported></Unsupported>

  return (
    // React router provider
    <Router>
      <SolanaProvider
        defaultNetwork="devnet"
      >
        {/* Loading Status context toggle provider */}
        <LoadingStatusToggle.Provider value={loadingToggleProps}>
        {/* Context for user actions recieved over WS, to support dynamic updates */} 
        <userActionContext.Provider value={userActions}>
          {/* Renders App triggers on load (such as auto logging into wallet) */}
          {/* Loads specifically one route at a time */}
          <ErrorBoundary>
          <NotificationContainer>
            <ApiStateHandler state={apiState}/>
            {/*<Route path="/" render={props =>
              <WinNotification
                addWinNotification={addWinNotification}
              />}
            />*/}
            <Switch>
              <Route path="/" exact component={SwapPage} />
              <Route path="/dashboard" exact render={props =>
                <Dashboard
                  prizeBoard={prizeBoard}
                  prizePool={rewardPool}
                  pastWinnings={pastWinnings}
                  {...props}
                />}
              />
              <ProtectedRoute exact={true} path="/wallet" component={Wallet} />
              <ProtectedRoute exact={true} path="/walletsend" component={WalletSend} myHistory={userActions} />
              <ProtectedRoute exact={true} path="/wallethistory" component={WalletHistory} myHistory={userActions}/>
              <Route component={RouteNotFound} />
            </Switch>
            {/* Loading modal for transactiongs */}
            <LoadingStatusModal enable={loadingToggler} />
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
              message={
                [<div>🎉🎉<span className="primary-text">  CONGRATS  </span>🎉🎉</div>,
                <div className="primary-text">
                  {notificationMessage}
                </div>]
              }
            />

          </NotificationContainer>
          </ErrorBoundary>
        </userActionContext.Provider>
        </LoadingStatusToggle.Provider>
      </SolanaProvider>
    </Router>
  );
}
export default App;
