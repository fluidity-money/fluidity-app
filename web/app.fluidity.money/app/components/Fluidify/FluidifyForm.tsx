import type { TransactionResponse } from "~/util/chainUtils/instructions";

import { useContext, useState } from "react";
import BN from "bn.js";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { Text, GeneralButton } from "@fluidity-money/surfing";
import AugmentedToken from "~/types/AugmentedToken";
import {
  addDecimalToBn,
  getTokenAmountFromUsd,
  getUsdFromTokenAmount,
} from "~/util/chainUtils/tokens";

interface IFluidifyFormProps {
  handleSwap: (receipt: TransactionResponse, amount: string) => void;
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

  const tokenDecimals = assetToken.decimals;

  const [swapInput, setSwapInput] = useState<string>("");

  const parseSwapInputToTokenAmount = (input: string): BN => {
    const [whole, dec] = input.split(".");

    const wholeBn = getTokenAmountFromUsd(new BN(whole || 0), assetToken);

    if (dec === undefined) {
      return wholeBn;
    }

    const decimalsBn = new BN(dec).mul(
      new BN(10).pow(new BN(assetToken.decimals - dec.length))
    );

    return wholeBn.add(decimalsBn);
  };

  // Snap the smallest of token balance, remaining mint limit, or swap amt
  const snapToValidValue = (input: string): BN => {
    const usdBn = parseSwapInputToTokenAmount(input);

    const maxUserPayable = BN.min(usdBn, assetToken.userTokenBalance);

    if (!assetToken.userMintLimit) {
      return maxUserPayable;
    }

    const maxMintable = assetToken.userMintLimit.sub(
      assetToken.userMintedAmt || new BN(0)
    );

    return BN.min(maxUserPayable, maxMintable);
  };

  const swapAmount: BN = snapToValidValue(swapInput);

  const assertCanSwap =
    connected &&
    !!address &&
    !!fluidTokenAddress &&
    !!swap &&
    !!assetToken.userTokenBalance &&
    swapAmount.gt(new BN(0)) &&
    swapAmount.lte(assetToken.userTokenBalance) &&
    (assetToken.userMintLimit === undefined ||
      swapAmount.lte(
        assetToken.userMintLimit.sub(assetToken.userMintedAmt || new BN(0))
      ));

  const handleChangeSwapInput: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const numericChars = e.target.value.replace(/[^0-9.]+/, "");

    const [whole, dec] = numericChars.split(".");

    const unpaddedWhole = whole === "" ? "" : parseInt(whole) || 0;

    if (dec === undefined) {
      return setSwapInput(`${unpaddedWhole}`);
    }

    const limitedDecimals = dec.slice(0 - tokenDecimals);

    return setSwapInput([whole, limitedDecimals].join("."));
  };

  const inputMaxBalance = () => {
    return setSwapInput(
      addDecimalToBn(
        snapToValidValue(assetToken.userTokenBalance.toString()),
        assetToken.decimals
      )
    );
  };

  const swapAndRedirect: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();

    if (!assertCanSwap) return;

    if (!swap) return;

    if (!assetToken) return;

    try {
      const receipt = await swap(swapAmount.toString(), assetToken.address);

      if (receipt) {
        handleSwap(receipt, addDecimalToBn(swapAmount, assetToken.decimals));
      }
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
          src={assetToken.logo || ""}
        />
        {/* Swap Field */}
        <input
          className={"fluidify-input"}
          min={""}
          value={swapInput}
          onBlur={(e) =>
            setSwapInput(
              addDecimalToBn(
                snapToValidValue(e.target.value),
                assetToken.decimals
              )
            )
          }
          onChange={handleChangeSwapInput}
          placeholder="0"
          step="any"
        />

        <Text size="lg">{assetToken.symbol || ""}</Text>

        <GeneralButton
          version={"transparent"}
          size="small"
          buttontype="text"
          type={"button"}
          handleClick={inputMaxBalance}
          disabled={
            assetToken.userTokenBalance.eq(new BN(0)) ||
            swapAmount.eq(assetToken.userTokenBalance)
          }
        >
          max
        </GeneralButton>
      </section>

      <hr className={"fluidify-form-el"} />

      {/* Creating / Remaining Tokens */}
      <Text>
        Creating {addDecimalToBn(swapAmount, toToken.decimals)}{" "}
        {toToken.symbol || ""}
      </Text>
      {/* Tokens User Holds */}
      <Text prominent>
        {addDecimalToBn(assetToken.userTokenBalance, assetToken.decimals)}{" "}
        {assetToken.symbol || ""} ($
        {getUsdFromTokenAmount(assetToken.userTokenBalance, assetToken)})
        remaining in wallet.
      </Text>

      {/* Daily Limit */}
      {!!assetToken.userMintLimit && (
        <Text>
          Daily {assetToken.symbol} limit:{" "}
          {addDecimalToBn(
            assetToken.userMintedAmt || new BN(0),
            assetToken.decimals
          )}
          /{addDecimalToBn(assetToken.userMintLimit, assetToken.decimals)}
        </Text>
      )}

      {/* Submit Button */}
      <GeneralButton
        version={"primary"}
        size="large"
        buttontype="text"
        type={"submit"}
        handleClick={() => client?.track("user", swapping ? "click_swapping" : "click_reverting")}
        disabled={!assertCanSwap}
        className={"fluidify-form-submit"}
      >
        {tokenIsFluid
          ? !swapping
            ? "Revert Fluid Asset"
            : `Reverting ${assetToken.symbol}`
          : !swapping
          ? "Create Fluid Asset"
          : `Creating ${toToken.symbol || ""}...`}
      </GeneralButton>

      <Text size="sm" className="swap-footer-text">
        By pressing the button you agree to our{" "}
        <a href="https://static.fluidity.money/assets/fluidity-website-tc.pdf">
          terms of service
        </a>
        .
      </Text>
    </form>
  );
};

export default FluidifyForm;
