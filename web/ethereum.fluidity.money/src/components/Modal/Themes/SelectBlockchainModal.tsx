import Button from "components/Button";
import GenericModal from "components/Modal/GenericModal";
import { appTheme } from "util/appTheme";
import { chainIdFromEnv } from "util/chainId";
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
      blockchain: "Ethereum",
      icon: "/img/TokenIcons/ethereumIcon.svg",
      visible: true,
      networks: [
        // { name: "Mainnet", address: "https://app.ethereum.fluidity.money/",id:"1" },
        {
          name: "Ropsten",
          address: "https://ropsten.ethereum.fluidity.money/",
          id: "3",
        },
        // {
        //   name: "Kovan",
        //   address: "https://kovan.beta.fluidity.money/",
        //   id: "42",
        // },
      ],
    },
    // {
    //   blockchain: "Aurora",
    //   icon: "/img/Aurora/AuroraLogoTextBelow.svg",
    //   visible: true,
    //   networks: [
    //     {
    //       name: "Aurora",
    //       address: "https://app.aurora.fluidity.money/",
    //       id: "1313161554",
    //     },
    //   ],
    // },
    {
      blockchain: "Solana",
      icon: "/img/TokenIcons/solanaIcon.svg",
      visible: true,
      networks: [
        // { name: "Mainnet", address: "https://app.solana.fluidity.money/",id:"" },
        {
          name: "Devnet",
          address: "https://app.solana.beta.fluidity.money/",
          id: "",
        },
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
                className={
                  `${chainIdFromEnv()}` === network.id
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
                  <div className={`primary-text${appTheme}`}>
                    {network.name}
                  </div>
                </div>
                {`${chainIdFromEnv()}` === network.id ? (
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
      <div className="connect-modal-body--networks">
        <h2 className={`primary-text${appTheme}`}>Select a Blockchain</h2>
        <div className="connect-modal-form">{renderedOptions}</div>
      </div>
    </GenericModal>
  );
};

export default SelectBlockchainModal;
