import SelectBlockchainModal from "components/Modal/Themes/SelectBlockchainModal";
import { useState } from "react";
import { appTheme } from "util/appTheme";
import ChainId, { chainIdFromEnv } from "util/chainId";

const NetworkButton = () => {
  const [blockchainToggle, setBlockchainToggle] = useState(false);
  const blockchainModalToggle = () => {
    setBlockchainToggle(!blockchainToggle);
  };

  return (
    <>
      <div
        className={`select-blockchain${appTheme}`}
        onClick={() => setBlockchainToggle(true)}
      >
        <img src="/img/TokenIcons/ethereumIcon.svg" alt="eth icon" />
        <div className={`chain-name primary-text${appTheme}`}>
          {chainIdFromEnv() === ChainId.Ropsten
            ? "Ropsten"
            : chainIdFromEnv() === ChainId.Kovan
            ? "Kovan"
            : chainIdFromEnv() === ChainId.Mainnet
            ? "Mainnet"
            : chainIdFromEnv() === ChainId.AuroraMainnet
            ? "Aurora"
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
