import {
  GeneralButton,
  Heading,
  LinkButton,
  Text,
} from "@fluidity-money/surfing";
import BloomEffect from "./BloomEffect";
import Modal from "./Modal";
import { ColorMap } from "~/webapp.config.server";
import AugmentedToken from "~/types/AugmentedToken";

interface ISwapCompleteModalProps {
  visible: boolean;
  close: () => void;
  colorMap: ColorMap[string];
  assetToken: AugmentedToken;
}

const SwapCompleteModal = ({
  visible,
  close,
  colorMap,
  assetToken,
}: ISwapCompleteModalProps) => {
  return (
    <Modal visible={visible}>
      <div className="swap-complete-container">
        <div>
          <LinkButton
            handleClick={close}
            size="large"
            type="internal"
            left={true}
            className="cancel-btn"
          >
            Close
          </LinkButton>
        </div>
        <div className="swap-complete-modal-top">
          <BloomEffect
            type={"static"}
            color={colorMap[assetToken.symbol] ?? "#fff"}
          />
          <img
            src={assetToken?.logo}
            style={{
              aspectRatio: "1 / 1",
              height: "10%",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />

          <img
            className="complete-fluidify-circle"
            src="/images/fluidify/fluidify-hotspot.png"
          />
        </div>
        <div className="swap-complete-modal-content">
          <Heading as="h5">
            100 fUSDC ($2,772 USD) created and added to your wallet.
          </Heading>
          <Text>31 USDC ($859.32) remaining in wallet..</Text>
          <GeneralButton
            buttontype="text"
            size="large"
            version="primary"
            handleClick={() => {
              return;
            }}
          >
            GO TO ASSETS
          </GeneralButton>
          <LinkButton
            type="internal"
            size="medium"
            handleClick={() => {
              return;
            }}
          >
            FLUIDIFY MORE ASSETS
          </LinkButton>
        </div>
      </div>
    </Modal>
  );
};

export default SwapCompleteModal;
