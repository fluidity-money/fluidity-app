import { useEffect, useState } from "react";
import Button from "components/Button";
import Icon from "components/Icon";
import { useHistory } from "react-router-dom";
import WalletConnectedModal from "components/Modal/Themes/WalletConnectModal";
import PendingWinsModal from "components/Modal/Themes/PendingWinsModal";
import { useWallet } from "use-wallet";
import { JsonRpcProvider } from "ethers/providers";
import { ConnectWalletModal } from "components/Modal";
import ToolBarMobileVersion from "./ToolBarMobileVersion";
import Media from "react-media";
import {
  EnabledButton,
  enableNotifications,
} from "components/NotificationAlert/notificationAlert";
import { trimAddress } from "util/addresses";
import NetworkButton from "components/Button/NetworkButton";
import { appTheme } from "util/appTheme";
import ChainId, { chainIdFromEnv } from "util/chainId";
import { apiPOSTBody } from "util/api";
import { ethers } from "ethers";
import { B64ToUint8Array } from "util/conversion";
import Routes from "util/api/types";
import NotificationButton from "components/Button/NotificationButton";

// For toolbar toggle of which button is selected
interface selected {
  options: [boolean, boolean, boolean];
}

export const FluidityToolBarTheme = ({ selected }: { selected: selected }) => {
  const history = useHistory();
  const [toggle, setToggle] = useState(false); // State to toggle connect wallet modal status
  const wallet = useWallet<JsonRpcProvider>();
  // maintain a separate setter to not spam reconnect on invalid load state
  const [active, setActive] = useState(wallet.status === "connected");
  const [address, setAddress] = useState(wallet.account || "Loading...");

  const [showPendingWins, setShowPendingWins] = useState(false);
  const [pendingWins, setPendingWins] = useState<Routes["/pending-rewards"]>(
    []
  );

  const modalToggle = () => {
    setToggle(!toggle);
  };

  const [notificationStatus, setNotificationStatus] = useState(false);

  useEffect(() => {
    const status = updateNotificationStatus();
    if (status != notificationStatus) setNotificationStatus(status);
  });

  const updateNotificationStatus = () => {
    //check for notification support
    if (typeof Notification === "undefined") return false;
    return (
      Notification.permission === "denied" ||
      Notification.permission !== "granted"
    );
  };

  const checkNotifications = () => {
    enableNotifications().then(() => {
      const status = updateNotificationStatus();
      if (status != notificationStatus) setNotificationStatus(status);
    });
  };

  // Address in a12345...6789 format
  useEffect(() => {
    if (wallet.account) setAddress(trimAddress(wallet.account));
  }, [wallet.account]);

  // watch wallet status
  useEffect(() => {
    // force a reset if the account wasn't loaded properly
    if (wallet.status === "connected" && wallet.account === null) {
      const previousConnector = wallet.connector;
      wallet.reset();
      wallet.connect(previousConnector);
    }

    // use (prev) => set pattern to avoid spam retries
    setActive((_active) => wallet.status === "connected");
  }, [wallet.status]);

  const fetchPendingWins = async () => {
    if (!wallet.account) return;

    const pending = await apiPOSTBody("/pending-rewards", {
      address: wallet.account,
    });
    setPendingWins(pending);
  };

  return (
    <Media queries={{ small: { maxWidth: 890 } }}>
      {(matched) =>
        !matched.small ? (
          <div
            className={`toolbar-container-${
              notificationStatus ? "enabled" : "disabled"
            }`}
          >
            <div className="toolbar-items">
              <Icon
                src="i-fluidity-medium"
                trigger={() => history.push("/dashboard")}
              />
              <div></div>
              <Button
                label="Dashboard"
                theme={`primary-text${appTheme}`}
                texttheme="header-text"
                padding="toolbarBtnPadding"
                goto={() => history.push("/dashboard")}
                selected={selected.options[0]}
                auth={active}
                priviledge={0}
              />
              <Button
                label="Swap"
                theme={`primary-text${appTheme}`}
                texttheme="header-text"
                padding="toolbarBtnPadding"
                goto={() => history.push("/")}
                selected={selected.options[1]}
                auth={active}
                priviledge={0}
              />
              <Button
                label="Wallet"
                theme={`primary-text${appTheme}`}
                texttheme="header-text"
                padding="toolbarBtnPadding"
                goto={() => history.push("/wallet")}
                selected={selected.options[2]}
                auth={active}
                priviledge={1}
              />
              <Button
                label={`${
                  pendingWins.length > 0 ? "Show" : "Fetch"
                } Pending Wins`}
                theme={`primary-text${appTheme}`}
                texttheme="header-text"
                padding="toolbarBtnPadding"
                goto={() =>
                  pendingWins.length > 0
                    ? setShowPendingWins(true)
                    : fetchPendingWins()
                }
                selected={false}
                auth={active}
                priviledge={1}
              />
            </div>
            <div></div>
            <div className="button-container">
              {/* <div className="primary-button p-0_5" onClick={() => enableNotifications()}> */}
              {/* <Icon
          src={updateNotificationStatus()}
          style={{alignSelf: 'center', justifySelf: 'center', }}
        /> */}

              {
                <EnabledButton enabled={notificationStatus}>
                  <Button
                    label="Enable Notifications"
                    theme={`primary-button${appTheme}--toolbar margin-right`}
                    goto={checkNotifications}
                    padding="p-0_5"
                  />
                </EnabledButton>
              }
              <NotificationButton />
              <NetworkButton />
              {active ? (
                <div
                  className="flex row align mobile-address-btn"
                  onClick={() => setToggle(true)}
                >
                  <Button
                    label={address}
                    theme={`primary-text${appTheme} header-text`}
                    goto={() => {
                      setToggle(true);
                    }}
                    padding="py-0_5"
                  />
                  <Icon src="i-wallet-arrow" />
                </div>
              ) : (
                <Button
                  label={"Connect Wallet"}
                  theme={`primary-button${appTheme}--toolbar`}
                  goto={() => {
                    setToggle(true);
                  }}
                  padding="p-0_5"
                />
              )}
            </div>
            <PendingWinsModal
              enable={showPendingWins}
              toggle={() => setShowPendingWins(!showPendingWins)}
              provider={wallet.ethereum}
              pendingWins={pendingWins}
              fetchNew={fetchPendingWins}
            />

            {active ? (
              <WalletConnectedModal
                enable={toggle}
                toggle={modalToggle}
                wallet={wallet}
                address={address}
              />
            ) : (
              <ConnectWalletModal
                enable={toggle}
                toggle={modalToggle}
                height="auto"
              />
            )}
          </div>
        ) : (
          <ToolBarMobileVersion selected={selected} />
        )
      }
    </Media>
  );
};
