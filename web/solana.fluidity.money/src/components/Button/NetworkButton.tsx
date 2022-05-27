import SelectBlockchainModal from "components/Modal/Themes/SelectBlockchainModal";
import { useState } from "react";
// import { appTheme } from "util/appTheme";
// import ChainId, { chainIdFromEnv } from "util/chainId";

const NetworkButton = () => {
  const [blockchainToggle, setBlockchainToggle] = useState(false);
  const blockchainModalToggle = () => {
    setBlockchainToggle(!blockchainToggle);
  };

  const network =
    process.env.REACT_APP_SOL_NETWORK === "mainnet" ? "Mainnet" : "Devnet";

  return (
    <>
      <div
        className={`select-blockchain`}
        onClick={() => setBlockchainToggle(true)}
      >
        <img src={"/img/TokenIcons/solanaIcon.svg"} alt="eth icon" />
        <div className={`chain-name primary-text`}>{`${network}`}</div>
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
