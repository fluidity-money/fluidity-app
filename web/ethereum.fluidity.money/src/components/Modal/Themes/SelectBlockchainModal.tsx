import Button from "components/Button";
import GenericModal from "components/Modal/GenericModal";
import React, { useEffect } from "react";
import ChainId, { chainIdFromEnv } from "util/chainId";

interface Blockchain {
  blockchain: string;
  icon: string;
  visible: boolean;
  networks: Network[];
}

interface Network {
  name: string;
  address: string;
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
  const aurora = chainIdFromEnv() === ChainId.AuroraMainnet ? "--aurora" : "";
  const networkOptions: Blockchain[] = [
    {
      blockchain: "Ethereum",
      icon: "/img/TokenIcons/ethereumIcon.svg",
      visible: true,
      networks: [
        { name: "Ropsten", address: "https://ropsten.beta.fluidity.money/" },
        { name: "Kovan", address: "https://kovan.beta.fluidity.money/" },
        { name: "Aurora", address: "https://app.aurora.fluidity.money/" },
      ],
    },
    {
      blockchain: "Solana",
      icon: "/img/TokenIcons/solanaIcon.svg",
      visible: true,
      networks: [
        { name: "Mainnet", address: "https://app.solana.fluidity.money/" },
        { name: "Devnet", address: "https://app.solana.beta.fluidity.money/" },
      ],
    },
  ];
  const [options, setOptions] = React.useState(networkOptions);
  useEffect(() => {
    const data = window.localStorage.getItem("networks-open");
    if (data) setOptions(JSON.parse(data));
  }, []);
  useEffect(() => {
    window.localStorage.setItem("networks-open", JSON.stringify(options));
  }, [options]);
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
            texttheme={`wallet-text${aurora}`}
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
                className={"network-options"}
                key={`${network} ${idx}`}
                onClick={() => {
                  // eslint-disable-next-line no-restricted-globals
                  location.href = network.address;
                }}
              >
                <img src={icon} className={`network-icon`} alt={blockchain} />
                <div className={`primary-text${aurora}`}>{network.name}</div>
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
      <div className="connect-modal-body--networks">
        <h2 className={`primary-text${aurora}`}>Select a Blockchain</h2>
        <div className="connect-modal-form">{renderedOptions}</div>
      </div>
    </GenericModal>
  );
};

export default SelectBlockchainModal;
