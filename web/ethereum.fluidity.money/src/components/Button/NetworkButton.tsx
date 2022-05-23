import SelectBlockchainModal from "components/Modal/Themes/SelectBlockchainModal";
import { useState } from "react";
import ChainId, { chainIdFromEnv } from "util/chainId";

const NetworkButton = () => {
  const [blockchainToggle, setBlockchainToggle] = useState(false);
  const blockchainModalToggle = () => {
    setBlockchainToggle(!blockchainToggle);
  };
  const aurora = chainIdFromEnv() === ChainId.AuroraMainnet ? "--aurora" : "";
  return (
    <>
      <div
        className={`select-blockchain${aurora}`}
        onClick={() => setBlockchainToggle(true)}
      >
        <img
          src={
            chainIdFromEnv() === ChainId.AuroraMainnet
              ? "/img/Aurora/AuroraLogoTextRight.svg"
              : "/img/TokenIcons/ethereumIcon.svg"
          }
          alt="eth icon"
        />
        <div className={`chain-name primary-text${aurora}`}>
          {chainIdFromEnv() === ChainId.Ropsten
            ? "Ropsten"
            : chainIdFromEnv() === ChainId.Kovan
            ? "Kovan"
            : chainIdFromEnv() === ChainId.Mainnet
            ? "Mainnet"
            : chainIdFromEnv() === ChainId.AuroraMainnet
            ? ""
            : "Ethereum"}
        </div>
      </div>
      <div>
        <SelectBlockchainModal
          enable={blockchainToggle}
          toggle={blockchainModalToggle}
          height="auto"
        />
      </div>
    </>
  );
};

export default NetworkButton;
