import Button from "components/Button";
import GenericModal from "components/Modal/GenericModal";

interface Network {
  network: string;
  icon: string;
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
  const options: Network[] = [
    // {
    //   network: "Solana",
    //   icon: "/img/TokenIcons/solanaIcon.svg",
    //   address: "https://app.solana.fluidity.money/",
    // },
    {
      network: "Solana Devnet",
      icon: "/img/TokenIcons/solanaIcon.svg",
      address: "https://app.solana.beta.fluidity.money/",
    },
    // {
    //   network: "Ethereum",
    //   icon: "/img/TokenIcons/ethereumIcon.svg",
    //   address: "https://app.ethereum.fluidity.money/",
    // },
    {
      network: "Ethereum Ropsten",
      icon: "/img/TokenIcons/ethereumIcon.svg",
      address: "https://ropsten.beta.fluidity.money/",
    },
    {
      network: "Ethereum Kovan",
      icon: "/img/TokenIcons/ethereumIcon.svg",
      address: "https://kovan.beta.fluidity.money/",
    },
    {
      network: "Aurora",
      icon: "/img/Aurora/AuroraLogoTextBelow.svg",
      address: "https://app.aurora.fluidity.money/",
    },
  ];
  const renderedOptions = options.map(({ network, icon, address }, index) => {
    return (
      <Button
        label={network}
        key={index}
        theme={`wallet-button`}
        texttheme="wallet-text"
        icon={
          // nosemgrep: typescript.react.security.audit.react-http-leak.react-http-leak
          <img src={icon} className={`wallet-icon`} alt={network} />
        }
        goto={() => {
          // eslint-disable-next-line no-restricted-globals
          location.href = address;
        }}
        // disabled={isConnected}
      />
    );
  });

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
