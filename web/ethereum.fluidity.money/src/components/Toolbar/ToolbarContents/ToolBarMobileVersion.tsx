import { useState } from "react";
import Button from "components/Button";
import Icon from "components/Icon";
import { useHistory } from "react-router-dom";
import ConnectWalletModal from "components/Modal/Themes/ConnectWalletModal";
import { useWallet } from "use-wallet";
import { JsonRpcProvider } from "ethers/providers";
import WalletConnectedModal from "components/Modal/Themes/WalletConnectModal";
import NetworkButton from "components/Button/NetworkButton";
import { appTheme } from "util/appTheme";
import NotificationButton from "components/Button/NotificationButton";

// For toolbar toggle of which button is selected
interface selected {
  options: [boolean, boolean, boolean];
}

const ToolBarMobileVersion = ({ selected }: { selected: selected }) => {
  const history = useHistory();
  const wallet = useWallet<JsonRpcProvider>();
  const active = wallet.status === "connected";
  // Address in a12345...6789 format
  const address =
    `${wallet.account}`.substr(0, 6) +
    "..." +
    `${wallet.account}`.substr(
      `${wallet.account}`.length - 4,
      `${wallet.account}`.length - 1
    );
  const [toggle, setToggle] = useState(false);
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const modalToggle = () => {
    setToggle(!toggle);
  };

  return (
    <div className="toolbar-container-mobile flex-space-between">
      <div className="fluidity-toolbar flex row flex-space-between width-auto">
        <Icon src="i-fluidity-medium" />
        <div className="fluidity-text">Fluidity.</div>
      </div>
      {/* <Icon src="i-fluidity-medium" /> */}

      <div className="flex column align w-50">
        <div className="menu-icon">
          <NetworkButton />
          <NotificationButton />
          <div
            id="nav-icon-bar"
            className={`icon ${click ? "open" : ""}`}
            onClick={handleClick}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
      <div className="wallet-address-container">
        {active ? (
          <div
            className="connect-wallet-address"
            onClick={() => setToggle(true)}
          >
            <Button
              label={address}
              theme={`primary-text${appTheme} header-text-connect-wallet-address`}
              goto={() => {}}
              padding="p-0_5"
            />
            {active ? <Icon src="i-wallet-arrow" /> : <></>}
          </div>
        ) : (
          <div
            className="connect-wallet-address"
            onClick={() => setToggle(true)}
          >
            <Button
              label="Connect Wallet"
              theme={`primary-text${appTheme} header-text`}
              goto={() => {}}
              padding="p-0_5"
            />
            {active ? <Icon src="i-wallet-arrow" /> : <></>}
          </div>
        )}
      </div>

      <div className={click ? "nav-menu active" : "nav-menu"}>
        <div className="title-dropdown">Menu</div>
        <div className="bar-dropdown"></div>
        {!active ? (
          <div className="flex row align" onClick={() => setToggle(true)}>
            <Button
              label={"Connect Wallet"}
              theme={`primary-text${appTheme} header-text`}
              goto={() => {}}
              padding="p-0_5"
            />
          </div>
        ) : (
          <></>
        )}
        <div className="btn-toolbar" onClick={closeMobileMenu}>
          <Button
            label="Dashboard"
            theme={`primary-text${appTheme}`}
            goto={() => history.push("/dashboard")}
            selected={selected.options[0]}
            auth={active}
            priviledge={0}
          />
        </div>
        <div className="btn-toolbar" onClick={closeMobileMenu}>
          <Button
            label="Swap"
            theme={`primary-text${appTheme}`}
            fontSize="large"
            goto={() => history.push("/")}
            selected={selected.options[1]}
            auth={active}
            priviledge={0}
          />
        </div>

        <div className="btn-toolbar" onClick={closeMobileMenu}>
          <Button
            label="Wallet"
            theme={`primary-text${appTheme}`}
            goto={() => history.push("/wallet")}
            selected={selected.options[2]}
            auth={active}
            priviledge={1}
          />
        </div>
      </div>

      {/* Modals */}
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
  );
};

export default ToolBarMobileVersion;
