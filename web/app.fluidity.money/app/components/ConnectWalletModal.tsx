import { Text } from "@fluidity-money/surfing";
import { useLoaderData } from "@remix-run/react";
import { WalletName, WalletReadyState } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useState, useContext } from "react";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { createPortal } from "react-dom";

interface IConnectWalletModal {
  visible: boolean;
  close: () => void;
}

type Wallet = {
  name: string;
  id: string;
  description: string;
  logo: string;
};

type LoaderData = {
  network: string;
  ethereumWallets: Wallet[];
};

const ConnectWalletModal = ({ visible, close }: IConnectWalletModal) => {
  const { network } = useLoaderData<LoaderData>();

  const [modal, setModal] = useState<React.ReactPortal | null>(null);

  const SolWalletsMap = () => {
    const { wallets, select } = useWallet();

    const selectWallet = useCallback(
      (
        _event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        walletName: WalletName
      ) => {
        select(walletName);
      },
      [select]
    );

    return (
      <>
        {wallets.map((wallet) => (
          <li
            key={`wallet-${wallet.adapter.name}`}
            onClick={(event) => selectWallet(event, wallet.adapter.name)}
          >
            <span>
              <img src={wallet?.adapter.icon} />
              <Text size="sm" className="connect-wallet-modal-names">
                {wallet.adapter.name}
              </Text>
            </span>
            <Text size="xs" className="connect-wallet-modal-status">
              <i>
                {wallet.readyState === WalletReadyState.Installed
                  ? "Installed"
                  : "Not Installed"}
              </i>
            </Text>
          </li>
        ))}
      </>
    );
  };

  const EthWalletsMap = () => {
    const { useConnectorType } = useContext(FluidityFacadeContext);
    const { ethereumWallets } = useLoaderData<LoaderData>();

    return (
      <>
        {ethereumWallets.map((wallet) => (
          <li
            key={`wallet-${wallet.name}`}
            onClick={() => {
              useConnectorType?.(wallet.id);
            }}
          >
            <span>
              <img src={wallet.logo} />
              <Text size="sm" className="connect-wallet-modal-names">
                {wallet.name}
              </Text>
            </span>
            <Text size="xs" className="connect-wallet-modal-status">
              <i></i>
            </Text>
          </li>
        ))}
      </>
    );
  };

  useEffect(() => {
    setModal(
      createPortal(
        <div
          className={`connect-wallet-outer-container ${
            visible === true ? "show-modal" : "hide-modal"
          }`}
          onClick={() => close()}
        >
          <div
            className={`connect-wallet-modal-container  ${
              visible === true ? "show-modal" : "hide-modal"
            }`}
          >
            <div className="connect-wallet-modal-header">
              <Text prominent size="xxl">
                Connect your wallet
              </Text>

              <img
                onClick={close}
                src="/images/icons/x.svg"
                className="modal-cancel-btn"
              />
            </div>

            <ul className="connect-wallet-modal-list">
              {network === "ethereum" && <EthWalletsMap />}
              {network === "solana" && <SolWalletsMap />}
            </ul>
            <Text size="xs">
              By connecting a wallet, you agree to Fluidity Money’s Terms of
              Service and acknowledge that you have read and understand the
              Disclaimer.
            </Text>
          </div>
        </div>,
        document.body
      )
    );
  }, [visible]);

  return modal;
};

export default ConnectWalletModal;
