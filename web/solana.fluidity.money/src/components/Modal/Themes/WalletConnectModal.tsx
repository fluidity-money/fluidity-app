// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import ReactDOM from "react-dom";
import Header from "components/Header";
import Icon from "components/Icon";
import FormSection from "components/Styling/FormSection";
import { useHistory } from "react-router-dom";
import {UseSolana} from "@saberhq/use-solana";
import {useWalletKit} from "@gokiprotocol/walletkit";

const WalletConnectedModal = ({ enable, toggle, wallet, address }: { enable: boolean; toggle: () => void; wallet: UseSolana<any>; address: string; }) => {

    const history = useHistory();
    const {connect: connectWallet} = useWalletKit();
    const copyAddress = () => {
        // Creates element
        let text = document.createElement("textarea");
        document.body.appendChild(text);
        // Assigns value and selects it
        text.value = `${wallet.publicKey}`;
        text.select();
        text.setSelectionRange(0, 99999); /* For mobile devices */
        // Copies to clipboard
        document.execCommand("copy");
        // Removes element from body post-copy
        document.body.removeChild(text);

        let element = document?.getElementById("copied-box") ?? document.createElement("junk");
        element.className = "copied-animation";

        setTimeout(() => {
            let element = document?.getElementById("copied-box") ?? document.createElement("junk");
            element.className = "hide";
        }, 3000);
    }

    // Returns name of connected wallet in our system based on connector
    const walletType = wallet.walletProviderInfo?.name ?? "";

    // Disconnects wallet
    const disconnect = () => {
        wallet.disconnect();
        // Disconnects wallet from active connection
        // useSigner()?.provider.on('disconnect', (error: ProviderRpcError) => null);
        // useSigner()?.provider
        history.push("/dashboard");
        toggle();
    }

    return (enable ? ReactDOM.createPortal(
        <div className="walletconnect-modal-container" onClick={() => toggle()}>
            <div
                className="modal-body"
                style={{ maxHeight: '22rem' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="walletconnect-modal-body">
                    {/* Modal header */}
                    <Header type="left primary" className="connected-wallet-modal-header">
                        My Wallet
                    </Header>
                    <FormSection cname="payment-modal-x" defaultMargin={false}>
                        <Icon src={"modal-close-x"} trigger={toggle} />
                    </FormSection>
                    {/* Wallet information */}
                    <FormSection cname="walletconnect-wallet-info" defaultMargin={false}>
                        <div className="swap-box-subheader primary-text">Connected with {walletType}</div>
                        <div className="walletconnect-account button" onClick={copyAddress}>{address}</div>
                    </FormSection>
                    {/* Copy Address */}
                    <div className="walletconnect-option-form column-span">
                        <FormSection onClickHandler={copyAddress} cname="walletconnect-option" defaultMargin={false}>
                            <Icon src="icon i-copy-address-icon" />
                            <div>Copy Address</div>
                            <div className="hide" id="copied-box">Copied</div>
                        </FormSection>
                        {/* Switch Provider */}
                        <FormSection onClickHandler={connectWallet} cname="walletconnect-option" defaultMargin={false}>
                            <Icon src="icon i-switch_provider-icon" />
                            <div>Switch Provider</div>
                        </FormSection>
                        {/* Disconnect Wallet */}
                        <FormSection onClickHandler={disconnect} cname="walletconnect-option" defaultMargin={false}>
                            <Icon src="icon i-disconnect-icon" />
                            <div>Disconnect</div>
                        </FormSection>
                    </div>
                </div>
            </div>
        </div>,
        document.querySelector("#modal-generic")!
    ) : <></>
    );
}

export default WalletConnectedModal;
