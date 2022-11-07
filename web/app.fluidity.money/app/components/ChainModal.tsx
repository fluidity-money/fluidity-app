import useViewport from "~/hooks/useViewport";
import { useNavigate, useLocation } from "@remix-run/react";
import { createPortal } from "react-dom";
import { BlockchainModal } from "@fluidity-money/surfing";
import { useState, useEffect } from "react";

type ChainOption = {
  [network: string]: {
    name: string;
    icon: JSX.Element;
  };
};

type IChainModal = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  chains: ChainOption;
  network: string;
};

const ChainModal = ({ visible, setVisible, chains, network }: IChainModal) => {
  const navigate = useNavigate();
  const location = useLocation();

  const networkMapper = (network: string) => {
    switch (network) {
      case "ETH":
        return "ethereum";
      case "SOL":
        return "solana";
      case "ethereum":
        return "ETH";
      case "solana":
        return "SOL";
    }
  };

  const { width } = useViewport();
  const mobileBreakpoint = 500;

  const setChain = (network: string) => {
    const { pathname } = location;

    // Get path components after $network
    const pathComponents = pathname.split("/").slice(2);

    navigate(`/${networkMapper(network)}/${pathComponents.join("/")}`);
  };

  const [modalElement, setModalElement] = useState<HTMLElement>();

  useEffect(() => {
    const modalRoot = document.body;
    const el = document.createElement("div");

    el.id = "wallet-modal";

    modalRoot.appendChild(el);
    setModalElement(el);

    return () => {
      modalRoot.removeChild(el);
    };
  }, []);

  return (
    <>
      {modalElement &&
        visible &&
        createPortal(
          <div className="cover">
            <BlockchainModal
              handleModal={setVisible}
              option={chains[network]}
              options={Object.values(chains)}
              setOption={setChain}
              mobile={width <= mobileBreakpoint}
            />
          </div>,
          modalElement
        )}
    </>
  );
};

export default ChainModal;
