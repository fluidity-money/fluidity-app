import TokenSelection from 'components/Modal/Themes/TokenSelection';
import { useContext } from 'react';
import { modalToggle } from "components/context";
import Icon from "components/Icon";
import { intOptions, extOptions } from "components/Token/TokenTypes";

const TokenSelect = ({
  type,
  toggle,
}: {
  type: string;
  toggle?: () => void;
}) => {
  const [selectedToken] = useContext(modalToggle).selectedToken;
  const [selectedFluidToken] = useContext(modalToggle).selectedFluidToken;

  switch (type) {
    case "token":
      return (
        <div
          className="token-selection-container flex align"
          onClick={toggle}
        >
          {selectedToken}
          <Icon
            src={`${selectedToken === "Select Token"
                ? "i-menu-dropdown-arrow"
                : `icon i-${selectedToken}`
              }`}
          />
          <TokenSelection tokenList={extOptions} type={type} />
        </div>
      );
    case "fluid":
      return (
        <div
          className="token-selection-container flex align"
          onClick={toggle}
        >
          {selectedFluidToken}
          <Icon
            src={`${selectedFluidToken === "Select FLUID"
                ? "i-menu-dropdown-arrow"
                : `icon i-${selectedFluidToken}`
              }`}
          />
          <TokenSelection tokenList={intOptions} type={type} />
        </div>
      );
    default:
      return <div></div>;
  }
};

export default TokenSelect;
