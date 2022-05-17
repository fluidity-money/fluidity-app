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
        className={
          chainIdFromEnv() === 1313161554
            ? "select-blockchain--aurora"
            : "select-blockchain"
        }
        onClick={() => setBlockchainToggle(true)}
      >
        <img src="/img/TokenIcons/ethereumIcon.svg" alt="eth icon" />
        <div
          className={
            chainIdFromEnv() === 1313161554
              ? "chain-name primary-text--aurora"
              : "chain-name primary-text"
          }
        >
          {chainIdFromEnv() === 3
            ? "Ropsten"
            : chainIdFromEnv() === 42
            ? "Kovan"
            : chainIdFromEnv() === 1
            ? "Mainnet"
            : chainIdFromEnv() === 1313161554
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
