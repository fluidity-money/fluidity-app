// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import ReactDOM from "react-dom";
import Header from "components/Header";
import Icon from "components/Icon";
import FormSection from "components/Styling/FormSection";
import { Wallet } from "use-wallet";
import { JsonRpcProvider } from "ethers/providers";
// import { disconnect } from "process";
import { useState } from "react";
import ConnectWalletModal from "components/Modal/Themes/ConnectWalletModal";
import { useHistory } from "react-router-dom";
import { appTheme } from "util/appTheme";

const WalletConnectedModal = ({
  enable,
  toggle,
  wallet,
  address,
}: {
  enable: boolean;
  toggle: () => void;
  wallet: Wallet<JsonRpcProvider>;
  address: string;
}) => {
  const history = useHistory();
  const [switchActive, setSwitchActive] = useState(false); // controls the modal status for wallet switching
  const copyAddress = () => {
    // Creates element
    let text = document.createElement("textarea");
    document.body.appendChild(text);
    // Assigns value and selects it
    text.value = `${wallet.account}`;
    text.select();
    text.setSelectionRange(0, 99999); /* For mobile devices */
    // Copies to clipboard
    document.execCommand("copy");
    // Removes element from body post-copy
    document.body.removeChild(text);

    let element =
      document?.getElementById("copied-box") ?? document.createElement("junk");
    element.className = "copied-animation";

    setTimeout(() => {
      let element =
        document?.getElementById("copied-box") ??
        document.createElement("junk");
      element.className = "hide";
    }, 3000);
  };

  // Returns name of connected wallet in our system based on connector
  const walletType = () => {
    switch (wallet.connector) {
      case "injected":
        return "Metamask";
      case "walletconnect":
        return "WalletConnect";
      default:
        return "Disconnected";
    }
  };

  const switchWallet = () => {
    if (switchActive) {
      setSwitchActive(!switchActive);
      return;
    }
    setSwitchActive(!switchActive);
    toggle();
  };

  // Disconnects wallet
  const disconnect = () => {
    wallet.reset();
    // Disconnects wallet from active connection
    // useSigner()?.provider.on('disconnect', (error: ProviderRpcError) => null);
    // useSigner()?.provider
    history.push("/dashboard");
    toggle();
  };

  if (switchActive) {
    return (
      <ConnectWalletModal
        enable={switchActive}
        toggle={switchWallet}
        height="auto"
        width="22.5rem"
      />
    );
  } else {
    return enable ? (
      ReactDOM.createPortal(
        <div className="walletconnect-modal-container" onClick={() => toggle()}>
          <div
            className="modal-body"
            style={{ maxHeight: "22rem" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="walletconnect-modal-body">
              {/* Modal header */}
              <Header
                type="left primary"
                className="connected-wallet-modal-header"
              >
                My Wallet
              </Header>
              <FormSection cname="payment-modal-x" defaultMargin={false}>
                <Icon src={"modal-close-x"} trigger={toggle} />
              </FormSection>
              {/* Wallet information */}
              <FormSection
                cname="walletconnect-wallet-info"
                defaultMargin={false}
              >
                <div className={`swap-box-subheader primary-text${appTheme}`}>
                  Connected with {walletType()}
                </div>
                <div className="walletconnect-account">{address}</div>
              </FormSection>
              {/* Copy Address */}
              <div className="walletconnect-option-form column-span">
                <FormSection
                  onClickHandler={copyAddress}
                  cname="walletconnect-option swap-field"
                  defaultMargin={false}
                >
                  <Icon src="icon i-copy-address-icon" />
                  <div>Copy Address</div>
                  <div className="hide" id="copied-box">
                    Copied
                  </div>
                </FormSection>
                {/* Switch Provider */}
                <FormSection
                  onClickHandler={switchWallet}
                  cname="walletconnect-option swap-field"
                  defaultMargin={false}
                >
                  <Icon src="icon i-switch_provider-icon" />
                  <div>Switch Provider</div>
                </FormSection>
                {/* Disconnect Wallet */}
                <FormSection
                  onClickHandler={disconnect}
                  cname="walletconnect-option swap-field"
                  defaultMargin={false}
                >
                  <Icon src="icon i-disconnect-icon" />
                  <div>Disconnect</div>
                </FormSection>
              </div>
            </div>
          </div>
        </div>,
        document.querySelector("#modal-generic")!
      )
    ) : (
      <></>
    );
  }
};

export default WalletConnectedModal;
