import Button from "components/Button";
import { Connectors, useWallet } from "use-wallet";
import { JsonRpcProvider } from "ethers/providers";
import GenericModal from "components/Modal/GenericModal";

const metamask = "/img/WalletIcons/metamask.png";
const walletconnect = "/img/WalletIcons/walletconnect.png";

const ConnectWalletModal = ({
  height,
  width,
  enable,
  toggle,
}: {
  height?: string;
  width?: string;
  enable: boolean;
  toggle: Function;
}) => {
  const wallet = useWallet<JsonRpcProvider>();

  // function to Connect wallet when button is pressed
  const connectWallet = async (connectorId: keyof Connectors) => {
    //don't reconnect if disconnecting
    const doReconnect = !(connectorId === wallet.connector);
    //reset existing connection
    wallet.reset();
    //connect to wallet
    if (doReconnect) await wallet.connect(connectorId);
    //close modal
    toggle();
  };

  type Options = {
    name: string;
    src: string; //png
    disabled?: boolean;
    connectorId: keyof Connectors;
  }[];
  const options: Options = [
    {
      name: "Metamask",
      src: metamask,
      connectorId: "injected",
    },
    {
      name: "WalletConnect",
      src: walletconnect,
      connectorId: "walletconnect",
    },
  ];

  const renderedOptions = options.map(
    ({ name, src, disabled, connectorId }, index) => {
      const isConnected =
        wallet.status === "connected" && connectorId === wallet.connector;
      return (
        <Button
          label={name}
          key={name + index}
          theme={`select-button--wallet ${(isConnected ?? "") && "active"}`}
          texttheme="wallet-text"
          //fontSize="font-large"
          icon={
            // nosemgrep: typescript.react.security.audit.react-http-leak.react-http-leak
            <img
              src={src}
              className={`wallet-icon ${(disabled ?? "") && "disabled"}`}
              alt={name}
            />
          }
          goto={() => {
            !disabled && connectWallet(connectorId);
          }}
          disabled={isConnected}
        />
      );
    }
  );
  return (
    <GenericModal
      enable={enable}
      toggle={() => toggle()}
      height={height}
      width={width}
    >
      <div className="connect-modal-body">
        <h2 className="primary-text">
          {wallet.status === "connected"
            ? "Wallet Connected"
            : "Connect to Wallet"}
        </h2>
        <div className="connect-modal-form">{renderedOptions}</div>
      </div>
    </GenericModal>
  );
};

export default ConnectWalletModal;
