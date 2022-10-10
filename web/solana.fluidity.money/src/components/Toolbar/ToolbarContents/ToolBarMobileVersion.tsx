// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { useState } from "react";
import Button from "components/Button";
import Icon from "components/Icon";
import { useHistory } from "react-router-dom";
import WalletConnectedModal from "components/Modal/Themes/WalletConnectModal";
import { useWalletKit } from "@gokiprotocol/walletkit";
import { useSolana } from "@saberhq/use-solana";
import NetworkButton from "components/Button/NetworkButton";
import NotificationButton from "components/Button/NotificationButton";

// For toolbar toggle of which button is selected
interface selected {
  options: [boolean, boolean, boolean];
}

const ToolBarMobileVersion = ({ selected }: { selected: selected }) => {
  const history = useHistory();
  // Address in a12345...6789 format
  const [toggle, setToggle] = useState(false);
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const sol = useSolana();
  const active = sol.connected;
  const { wallet } = sol;
  const { connect: connectWallet } = useWalletKit();

  const address =
    `${wallet?.publicKey}`.substr(0, 6) +
    "..." +
    `${wallet?.publicKey}`.substr(
      `${wallet?.publicKey}`.length - 4,
      `${wallet?.publicKey}`.length - 1
    );

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
              theme={"primary-text header-text-connect-wallet-address"}
              goto={() => {}}
              padding="p-0_5"
            />
            {active ? <Icon src="i-wallet-arrow" /> : <></>}
          </div>
        ) : (
          <div className="connect-wallet-address" onClick={connectWallet}>
            <Button
              label="Connect Wallet"
              theme={`primary-text header-text`}
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
              theme={"primary-text header-text"}
              goto={connectWallet}
              padding="p-0_5"
            />
          </div>
        ) : (
          <></>
        )}
        <div className="btn-toolbar" onClick={closeMobileMenu}>
          <Button
            label="Dashboard"
            theme="primary-text"
            goto={() => history.push("/dashboard")}
            selected={selected.options[0]}
            auth={active}
            priviledge={0}
          />
        </div>
        <div className="btn-toolbar" onClick={closeMobileMenu}>
          <Button
            label="Swap"
            theme="primary-text"
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
            theme="primary-text"
            goto={() => history.push("/wallet")}
            selected={selected.options[2]}
            auth={active}
            priviledge={1}
          />
        </div>
      </div>

      {/* Modals */}
      {active && (
        <WalletConnectedModal
          enable={toggle}
          toggle={modalToggle}
          wallet={sol}
          address={address}
        />
      )}
    </div>
  );
};

export default ToolBarMobileVersion;
