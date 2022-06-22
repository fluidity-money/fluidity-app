import Button from "components/Button";
import GenericModal from "components/Modal/GenericModal";
import React from "react";
import useLocalStorage from "util/hooks/useLocalStorage";

interface Blockchain {
  blockchain: string;
  icon: string;
  visible: boolean;
  networks: Network[];
}

interface Network {
  name: string;
  address: string;
  id: string;
}

const SelectBlockchainModal = ({
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
  const networkOptions: Blockchain[] = [
    {
      blockchain: "Solana",
      icon: "/img/TokenIcons/solanaIcon.svg",
      visible: true,
      networks: [
        // { name: "Mainnet", address: "https://app.solana.fluidity.money/",id:"mainnet" },
        {
          name: "Devnet",
          address: "https://app.solana.beta.fluidity.money/",
          id: "devnet",
        },
      ],
    },
    {
      blockchain: "Ethereum",
      icon: "/img/TokenIcons/ethereumIcon.svg",
      visible: true,
      networks: [
        // { name: "Mainnet", address: "https://app.ethereum.fluidity.money/",id:"" },
        {
          name: "Ropsten",
          address: "https://ropsten.beta.fluidity.money/",
          id: "",
        },
        {
          name: "Kovan",
          address: "https://kovan.beta.fluidity.money/",
          id: "",
        },
      ],
    },
    {
      blockchain: "Aurora",
      icon: "/img/Aurora/AuroraLogoTextBelow.svg",
      visible: true,
      networks: [
        {
          name: "Aurora",
          address: "https://app.aurora.fluidity.money/",
          id: "",
        },
      ],
    },
  ];
  // creates options state and stores in local storage
  const [options, setOptions] = useLocalStorage(
    "networks-open",
    networkOptions
  );

  const blockchainNetwork = process.env.REACT_APP_SOL_NETWORK;

  const renderedOptions = options.map(
    ({ blockchain, icon, networks, visible }, index) => {
      return (
        <div
          className={
            visible === true
              ? "blockchain-container"
              : "blockchain-container--closed"
          }
        >
          <Button
            label={blockchain}
            key={index}
            theme={`select-button`}
            texttheme={`wallet-text`}
            visible={visible}
            icon={
              // nosemgrep: typescript.react.security.audit.react-http-leak.react-http-leak
              <img src={icon} className={`wallet-icon`} alt={blockchain} />
            }
            goto={() => {
              setOptions((options: any) =>
                [...options]?.map((item) =>
                  item.blockchain === blockchain
                    ? Object.assign(item, { visible: !item.visible })
                    : item
                )
              );
            }}

            // disabled={isConnected}
          />
          {visible === true && <hr className="line" />}
          {visible === true &&
            networks.map((network, idx) => (
              <div
                className={
                  blockchainNetwork === network.id
                    ? "network-options-current"
                    : "network-options"
                }
                key={`${network} ${idx}`}
                onClick={() => {
                  // eslint-disable-next-line no-restricted-globals
                  location.href = network.address;
                }}
              >
                <div className="network-items">
                  <img src={icon} className={`network-icon`} alt={blockchain} />
                  <div className={`primary-text`}>{network.name}</div>
                </div>
                {blockchainNetwork === network.id ? (
                  <img src="/img/network-dot.svg" alt="dot" />
                ) : (
                  <></>
                )}
              </div>
            ))}
        </div>
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
        <h2 className="primary-text">Select a Blockchain</h2>
        <div className="connect-modal-form">{renderedOptions}</div>
      </div>
    </GenericModal>
  );
};

export default SelectBlockchainModal;
