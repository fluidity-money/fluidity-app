import { useEffect, useState } from "react";
import Button from "components/Button";
import Icon from "components/Icon";
import { useHistory } from "react-router-dom";
import WalletConnectedModal from "components/Modal/Themes/WalletConnectModal";
import ToolBarMobileVersion from "./ToolBarMobileVersion";
import Media from "react-media";
import {useSolana} from "@saberhq/use-solana";
import {
  EnabledButton,
  enableNotifications,
} from "components/NotificationAlert/notificationAlert";
import SelectBlockchainModal from "components/Modal/Themes/SelectBlockchainModal";
import {useWalletKit} from "@gokiprotocol/walletkit";
import NetworkButton from "components/Button/NetworkButton";

// For toolbar toggle of which button is selected
interface selected {
  options: [boolean, boolean, boolean];
}

export const FluidityToolBarTheme = ({ selected }: { selected: selected }) => {
  const history = useHistory();
  const [toggle, setToggle] = useState(false); // State to toggle connect wallet modal status
  const [blockchainToggle, setBlockchainToggle] = useState(false);
  // const wallet = useWallet<JsonRpcProvider>();
  const sol = useSolana();
  const active = sol.connected;
  const { wallet } = sol;
  const {connect: connectWallet} = useWalletKit();

  const modalToggle = () => {
    setToggle(!toggle);
  };

  const blockchainModalToggle = () => {
    setBlockchainToggle(!blockchainToggle);
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
  const address =
    `${wallet?.publicKey}`.substr(0, 6) +
    "..." +
    `${wallet?.publicKey}`.substr(
      `${wallet?.publicKey}`.length - 4,
      `${wallet?.publicKey}`.length - 1
    );

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
                theme="primary-text"
                texttheme="header-text"
                padding="toolbarBtnPadding"
                goto={() => history.push("/dashboard")}
                selected={selected.options[0]}
                auth={active}
                priviledge={0}
              />
              <Button
                label="Swap"
                theme="primary-text"
                texttheme="header-text"
                padding="toolbarBtnPadding"
                goto={() => history.push("/")}
                selected={selected.options[1]}
                auth={active}
                priviledge={0}
              />
              <Button
                label="Wallet"
                theme="primary-text"
                texttheme="header-text"
                padding="toolbarBtnPadding"
                goto={() => history.push("/wallet")}
                selected={selected.options[2]}
                auth={active}
                priviledge={1}
              />
            </div>
            <div></div>
            <div className="button-container">
              {/* <div className="flex row flex-space-between width-auto align"> */}
              {
                <EnabledButton enabled={notificationStatus}>
                  <Button
                    label="Enable Notifications"
                    theme={"primary-button mx-1-r"}
                    goto={checkNotifications}
                    padding="p-0_5"
                  />
                </EnabledButton>
              }
              {active ? (
                <div
                  className="flex row align mobile-address-btn"
                  onClick={() => setToggle(true)}
                >
                  <Button
                    label={address}
                    theme={"primary-text header-text"}
                    goto={() => {
                      setToggle(true);
                    }}
                    padding="p-0_5"
                  />
                  <Icon src="i-wallet-arrow" />
                </div>
              ) : (
                <Button
                  label={"Connect Wallet"}
                  theme={"primary-button"}
                  goto={connectWallet}
                  padding="p-0_5"
                />
              )}
              <NetworkButton />
            </div>
            <SelectBlockchainModal
              enable={blockchainToggle}
              toggle={blockchainModalToggle}
              height="auto"
            />
            {active && (
              <WalletConnectedModal
                enable={toggle}
                toggle={modalToggle}
                wallet={sol}
                address={address}
              />
            )
            }
          </div>
        ) : (
          <ToolBarMobileVersion selected={selected} />
        )
      }
    </Media>
  );
};
