import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { Asset } from "~/queries/useTokens";

const TokenSelectModal = ({
  assets,
  value,
  onSelect = () => {
    return;
  },
  onClose = () => {
    return;
  },
  open,
}: {
  assets: Asset[];
  value: Asset | undefined;
  open: boolean;
  onSelect: (asset: Asset) => void;
  onClose: () => void;
}) => {
  const [root, setRoot] = useState<HTMLElement>();

  useEffect(() => {
    const root = document.createElement("div");
    document.body.appendChild(root);
    setRoot(root);

    return () => {
      if (root) {
        document.body.removeChild(root);
      }
    };
  }, []);

  return open
    ? createPortal(
        <>
          <h1>Select a token</h1>
          {assets.map((asset) => (
            <div
              key={asset.contract_address}
              className={
                asset.contract_address === value?.contract_address
                  ? "selected"
                  : ""
              }
              onClick={() => {
                onSelect(asset);
                onClose();
              }}
            >
              <img src={asset.logo} />
              <p>{asset.name}</p>
              <p>{asset.symbol}</p>
            </div>
          ))}
        </>,
        root as HTMLElement
      )
    : null;
};

export default TokenSelectModal;
