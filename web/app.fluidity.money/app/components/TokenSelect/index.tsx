import { useState } from "react";
import TokenSelectModal from "./TokenSelectModal";
import {
  ProviderIcon,
  TriangleDown,
  Text,
  TokenIcon,
  numberToMonetaryString,
} from "@fluidity-money/surfing";
import { AnimatePresence, motion } from "framer-motion";
import { AugmentedAsset } from "~/routes/$network/transfer/send";
import { getUsdFromTokenAmount } from "~/util";

const TokenSelect = ({
  assets = [],
  onChange,
  value,
  disabled,
}: {
  assets: AugmentedAsset[];
  onChange: (token: AugmentedAsset) => void;
  value?: AugmentedAsset;
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="token-select-container">
      <button
        className={`token-select-button ${open ? "active" : ""}`}
        onClick={() => !disabled && setOpen(!open)}
      >
        {value ? (
          <TokenIcon className="token-select-icon" token={value.symbol} />
        ) : (
          <ProviderIcon className="token-select-icon" provider={"Fluidity"} />
        )}
        <div className="token-select-details">
          <Text prominent={!!value} size={value ? "lg" : "md"}>
            {value ? value.symbol : `${assets.length} fluid assets available`}
          </Text>
          {value && <Text>{value.name}</Text>}
        </div>
        {value && (
          <Text size="lg" prominent>
            {numberToMonetaryString(
              getUsdFromTokenAmount(value.userTokenBalance, value.decimals, 1)
            )}
          </Text>
        )}
        <motion.div
          initial={{ rotateX: 0 }}
          animate={{ rotateX: open ? 180 : 0 }}
        >
          <TriangleDown />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <TokenSelectModal
            assets={assets}
            onSelect={onChange}
            onClose={() => setOpen(false)}
            value={value}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TokenSelect;
