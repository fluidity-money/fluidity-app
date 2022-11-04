import useViewport from "~/hooks/useViewport";
import { useNavigate, useParams, useLocation } from "@remix-run/react";
import { createPortal } from "react-dom";
import { BlockchainModal } from "@fluidity-money/surfing";
import { useState, useEffect } from "react";

type IChainModal = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChainModal = ({ visible, setVisible }: IChainModal) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { network } = useParams();

  if (!network) {
    throw Error(`no network provided!`);
  }
  
  const networkMapper = (network: string) => {
    switch (network) {
    case "ETH": return "ethereum"
    case "SOL": return "solana"
    case "ethereum": return "ETH"
    case "solana": return "SOL"
  }
  }

  const { width } = useViewport();
  const mobileBreakpoint = 500;

  const options = {
    ethereum: {
      name: "ETH",
      icon: <img src="/assets/chains/ethIcon.svg" />,
    },
    solana: {
      name: "SOL",
      icon: <img src="/assets/chains/solanaIcon.svg" />,
    },
  };

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
  
  console.log(Object.values(options));

  return (
    <>
      {modalElement &&
        visible &&
        createPortal(
          <div className="cover">
            <BlockchainModal
              handleModal={setVisible}
              option={options[network as "ethereum" | "solana"]}
              className={"hello"}
              options={Object.values(options)}
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
