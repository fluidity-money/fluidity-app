import { useContext, useState } from "react";
import FluidityFacadeContext from "contexts/FluidityFacade";
import {
  Text,
  GeneralButton,
  numberToMonetaryString,
} from "@fluidity-money/surfing";
import AugmentedToken from "~/types/AugmentedToken";

interface IFluidifyFormProps {
  handleSwap: (token: AugmentedToken, amount: number) => void;
  assetToken: AugmentedToken;
  toToken: AugmentedToken;
  swapping: boolean;
}

export const FluidifyForm = ({
  handleSwap,
  assetToken,
  toToken,
  swapping,
}: IFluidifyFormProps) => {
  const { address, connected, swap } = useContext(FluidityFacadeContext);

  const fluidTokenAddress = assetToken.isFluidOf ?? toToken.isFluidOf ?? "";

  const [swapInput, setSwapInput] = useState<string>("0");

  // Snap the smallest of token balance, remaining mint limit, or swap amt
  const snapToValidValue = (input: string): number =>
    assetToken?.userMintLimit
      ? Math.min(
          parseFloat(input) || 0,
          (assetToken?.userMintLimit || 0) - (assetToken?.userMintedAmt || 0),
          assetToken.userTokenBalance || 0
        )
      : Math.min(parseFloat(input) || 0, assetToken.userTokenBalance || 0);

  const swapAmount: number = snapToValidValue(swapInput);

  const assertCanSwap =
    connected &&
    !!address &&
    !!fluidTokenAddress &&
    !!swap &&
    !!assetToken?.userTokenBalance &&
    !!swapAmount &&
    swapAmount <= (assetToken?.userTokenBalance || 0) &&
    (assetToken.userMintLimit === undefined ||
      swapAmount + (assetToken.userMintedAmt || 0) <= assetToken.userMintLimit);

  const handleChangeSwapInput: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const numericChars = e.target.value.replace(/[^0-9.]+/, "");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [whole, dec, _invalid] = numericChars.split(".");

    const unpaddedWhole = parseInt(whole) || 0;

    if (dec === undefined) {
      return setSwapInput(`${unpaddedWhole}`);
    }

    return setSwapInput([whole, dec].join("."));
  };

  const swapAndRedirect: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();

    if (!assertCanSwap) return;

    if (!swap) return;

    if (!assetToken) return;

    const rawTokenAmount = `${Math.floor(
      swapAmount * 10 ** assetToken.decimals
    )}`;

    try {
      await swap(rawTokenAmount.toString(), assetToken.address);

      handleSwap(assetToken, swapAmount);
    } catch (e) {
      // Expect error on fail
      console.log(e);
      return;
    }
  };

  const tokenIsFluid = !!assetToken.isFluidOf;

  return (
    <form className={"fluidify-form"} onSubmit={swapAndRedirect}>
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
          min={"0"}
          value={swapInput}
          onBlur={(e) => setSwapInput(`${snapToValidValue(e.target.value)}`)}
          onChange={handleChangeSwapInput}
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
          Daily {assetToken.symbol} limit: {assetToken.userMintedAmt || 0}/
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
        disabled={!assertCanSwap}
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
