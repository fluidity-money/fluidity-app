import { Text } from "@fluidity-money/surfing";
import { WalletName, WalletReadyState } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface IPropsSolanaWalletModal {
  visible: boolean;
  close: () => void;
}

export const SolanaWalletModal = ({
  visible,
  close,
}: IPropsSolanaWalletModal) => {
  const { wallets, select } = useWallet();
  const [modal, setModal] = useState<any>();

  const selectWallet = useCallback(
    (
      _event: React.MouseEvent<HTMLLIElement, MouseEvent>,
      walletName: WalletName
    ) => {
      console.log(walletName);
      select(walletName);
    },
    [select]
  );

  useEffect(() => {
    setModal(
      createPortal(
        <>
          <div
            className={`solana-wallet-modal-container  ${
              visible === true ? "show-modal" : "hide-modal"
            }`}
          >
            <Text prominent size="xxl">
              Connect your wallet
            </Text>
            <span onClick={close}>
              <img
                src="/images/icons/x.svg"
                className="solana-modal-cancel-btn"
              />
            </span>
            <ul className="solana-modal-wallet-list">
              {wallets.map((wallet) => (
                <>
                  <li
                    key={`wallet-${wallet.adapter.name}`}
                    onClick={(event) =>
                      selectWallet(event, wallet.adapter.name)
                    }
                  >
                    <span>
                      <img src={wallet?.adapter.icon} />
                      <Text size="xxl" className="solana-modal-wallet-names">
                        {wallet.adapter.name}
                      </Text>
                    </span>
                    <Text size="xs" className="solana-modal-wallet-status">
                      <i>
                        {wallet.readyState === WalletReadyState.Installed
                          ? "Installed"
                          : "Not Installed"}
                      </i>
                    </Text>
                  </li>{" "}
                  <hr />
                </>
              ))}
            </ul>
          </div>
        </>,
        document.body
      )
    );
  }, [visible]);

  return modal;
};
