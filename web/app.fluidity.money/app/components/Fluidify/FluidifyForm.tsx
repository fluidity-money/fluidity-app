import {
  Text,
  GeneralButton,
  numberToMonetaryString,
} from "@fluidity-money/surfing";
import AugmentedToken from "~/types/AugmentedToken";

interface IFluidifyFormProps {
  handleSwap: (e: React.FormEvent<HTMLFormElement>) => void;
  tokenIsFluid: boolean;
  swapAmount: number;
  setSwapAmount: React.Dispatch<React.SetStateAction<number>>;
  assetToken: AugmentedToken;
  toToken: AugmentedToken;
  swapping: boolean;
  formDisabled: () => boolean;
}

export const FluidifyForm = ({
  handleSwap,
  tokenIsFluid,
  swapAmount,
  setSwapAmount,
  assetToken,
  toToken,
  swapping,
  formDisabled,
}: IFluidifyFormProps) => {
  return (
    <form className={"fluidify-form"} onSubmit={handleSwap}>
      <Text size="lg" prominent>
        AMOUNT TO {tokenIsFluid ? "REVERT" : "FLUIDIFY"}
      </Text>

      <section className={"fluidify-form-el fluidify-input-container"}>
        <img
          className={`fluidify-form-logo ${
            tokenIsFluid ? "fluid-token-form-logo" : ""
          }`}
          src={assetToken?.logo || ""}
        />
        {/* Swap Field */}
        <input
          className={"fluidify-input"}
          type={"number"}
          min={"0"}
          value={swapAmount}
          onChange={(e) =>
            setSwapAmount(
              Math.min(
                parseFloat(e.target.value) || 0,
                assetToken.userTokenBalance || 0
              )
            )
          }
          placeholder=""
          step="any"
        />
        <Text size="lg">{assetToken?.symbol || ""}</Text>
      </section>

      <hr className={"fluidify-form-el"} />

      {/* Creating / Remaining Tokens */}
      <Text>
        Creating ${swapAmount} {toToken?.symbol || ""}
      </Text>
      {/* Tokens User Holds */}
      <Text prominent>
        {assetToken.userTokenBalance} {assetToken?.symbol || ""} (
        {numberToMonetaryString(assetToken.userTokenBalance || 0)}) remaining in
        wallet.
      </Text>

      {/* Daily Limit */}
      {!!assetToken?.userMintLimit && (
        <Text>
          Daily {assetToken.symbol} limit: {assetToken.userMintedAmt}/
          {assetToken.userMintLimit}
        </Text>
      )}

      {/* Submit Button */}
      <GeneralButton
        version={"primary"}
        size="large"
        buttontype="text"
        type={"submit"}
        handleClick={() => null}
        disabled={formDisabled()}
        className={"fluidify-form-submit"}
      >
        {tokenIsFluid
          ? !swapping
            ? "Revert Fluid Asset"
            : `Reverting ${assetToken?.symbol}`
          : !swapping
          ? "Create Fluid Asset"
          : `Creating ${toToken?.symbol || ""}...`}
      </GeneralButton>

      <Text size="sm" className="swap-footer-text">
        By pressing the button you agree to our <a>terms of service</a>.
      </Text>
    </form>
  );
};

export default FluidifyForm;
