import SelectBlockchainModal from "components/Modal/Themes/SelectBlockchainModal";
import { useState } from "react";
import { chainIdFromEnv } from "util/chainId";

const NetworkButton = () => {
  const [blockchainToggle, setBlockchainToggle] = useState(false);
  const blockchainModalToggle = () => {
    setBlockchainToggle(!blockchainToggle);
  };
  return (
    <>
      <div
        className="select-blockchain"
        onClick={() => setBlockchainToggle(true)}
      >
        <img src="/img/TokenIcons/ethereumIcon.svg" alt="eth icon" />
        <div className="chain-name primary-text">
          {chainIdFromEnv() === 3
            ? "Ropsten"
            : chainIdFromEnv() === 42
            ? "Kovan"
            : chainIdFromEnv() === 1
            ? "Mainnet"
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
