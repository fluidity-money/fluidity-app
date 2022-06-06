import Button from "components/Button";
import GenericModal from "components/Modal/GenericModal";
import { appTheme } from "util/appTheme";
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
      blockchain: "Ethereum",
      icon: "/img/TokenIcons/ethereumIcon.svg",
      visible: true,
      networks: [
        // { name: "Mainnet", address: "https://app.ethereum.fluidity.money/" },
        { name: "Ropsten", address: "https://ropsten.beta.fluidity.money/" },
        { name: "Kovan", address: "https://kovan.beta.fluidity.money/" },
      ],
    },
    {
      blockchain: "Aurora",
      icon: "/img/Aurora/AuroraLogoTextBelow.svg",
      visible: true,
      networks: [
        { name: "Aurora", address: "https://app.aurora.fluidity.money/" },
      ],
    },
    {
      blockchain: "Solana",
      icon: "/img/TokenIcons/solanaIcon.svg",
      visible: true,
      networks: [
        // { name: "Mainnet", address: "https://app.solana.fluidity.money/" },
        { name: "Devnet", address: "https://app.solana.beta.fluidity.money/" },
      ],
    },
  ];

  // using local storage hook to persist options and if all networks are visible or not
  const [options, setOptions] = useLocalStorage(
    "networks-open",
    networkOptions
  );

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
            texttheme={`wallet-text${appTheme}`}
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
                <div className={`primary-text${appTheme}`}>{network.name}</div>
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
        <h2 className={`primary-text${appTheme}`}>Select a Blockchain</h2>
        <div className="connect-modal-form">{renderedOptions}</div>
      </div>
    </GenericModal>
  );
};

export default SelectBlockchainModal;
