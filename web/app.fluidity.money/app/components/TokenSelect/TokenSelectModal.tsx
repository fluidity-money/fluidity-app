import {
  TokenIcon,
  Text,
  numberToMonetaryString,
} from "@fluidity-money/surfing";
import BN from "bn.js";
import { motion } from "framer-motion";
import { AugmentedAsset } from "~/routes/$network/transfer/send";
import { getUsdFromTokenAmount } from "~/util";

const modalVariants = {
  hidden: {
    height: 0,
  },
  visible: {
    height: "auto",
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
      staggerDirection: 1,
    },
  },
  exit: {
    height: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
};

const rowVariants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

interface ITokenSelectModal {
  assets: AugmentedAsset[];
  value: AugmentedAsset | undefined;
  onSelect: (asset: AugmentedAsset) => void;
  onClose: () => void;
}

const TokenSelectModal: React.FC<ITokenSelectModal> = ({
  assets,
  value,
  onSelect,
  onClose,
}: ITokenSelectModal) => {
  return (
    <motion.div
      className="token-select-modal"
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {assets.map((asset) => (
        <motion.div
          variants={rowVariants}
          key={asset.contract_address}
          className={`token-select-modal-row
            ${
              asset.contract_address === value?.contract_address
                ? "selected"
                : ""
            }
              `}
          onClick={() => {
            onSelect(asset);
            onClose();
          }}
        >
          <TokenIcon className="token-select-icon" token={asset.symbol} />
          <div className="token-select-details">
            <Text prominent size="lg">
              {asset.symbol}
            </Text>
            <Text>{asset.name}</Text>
          </div>
          <div className="token-select-details">
            <Text prominent size="lg">
              {numberToMonetaryString(
                getUsdFromTokenAmount(asset.userTokenBalance, asset.decimals, 1)
              )}
            </Text>
            <Text>
              {asset.userTokenBalance
                .div(new BN(10).pow(new BN(asset.decimals)))
                .toString()}{" "}
              at {numberToMonetaryString(1)}
            </Text>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default TokenSelectModal;
