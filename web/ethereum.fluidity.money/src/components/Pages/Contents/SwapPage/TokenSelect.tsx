import TokenSelection from "components/Modal/Themes/TokenSelection";
import { useContext, useEffect, useState } from "react";
import { modalToggle } from "components/context";
import Icon from "components/Icon";
import { TokenKind } from "components/types";
import ropsten from "../../../../config/ropsten-tokens.json";
import testing from "../../../../config/testing-tokens.json";
import kovan from "../../../../config/kovan-tokens.json";
import ChainId, {chainIdFromEnv} from "util/chainId";

const TokenSelect = ({
  type,
  toggle,
}: {
  type: string;
  toggle?: () => void;
}) => {
  const [selectedToken] = useContext(modalToggle).selectedToken;
  const [selectedFluidToken] = useContext(modalToggle).selectedFluidToken;

  // Assigns the correct json file based on ChainId
  const chainId = chainIdFromEnv();
  const data =
    chainId === ChainId.Ropsten ?
      (ropsten as TokenKind[]) :
    chainId === ChainId.Hardhat ?
      (testing as TokenKind[]) :
    chainId === ChainId.Kovan
      ? (kovan as TokenKind[])
      : (ropsten as TokenKind[]);

  const [extTokens, setExtTokens] = useState(data.slice(0, data.length / 2));
  const [intTokens, setIntTokens] = useState(
    data.slice(data.length / 2, data.length)
  );

  switch (type) {
    case "token":
      return (
        <div className="token-selection-container flex align" onClick={toggle}>
          {selectedToken}
          <Icon
            src={`${
              selectedToken === "Select Token"
                ? "i-menu-dropdown-arrow"
                : `icon i-${selectedToken}`
            }`}
          />
          <TokenSelection tokenList={extTokens} type={type} />
        </div>
      );
    case "fluid":
      return (
        <div className="token-selection-container flex align" onClick={toggle}>
          {selectedFluidToken}
          <Icon
            src={`${
              selectedFluidToken === "Select FLUID"
                ? "i-menu-dropdown-arrow"
                : `icon i-${selectedFluidToken}`
            }`}
          />
          <TokenSelection tokenList={intTokens} type={type} />
        </div>
      );
    default:
      return <div></div>;
  }
};

export default TokenSelect;
