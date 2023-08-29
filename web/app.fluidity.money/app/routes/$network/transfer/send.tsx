import {
  Card,
  Display,
  Heading,
  useViewport,
  Video,
  Text,
  GeneralButton,
  Form,
  TokenIcon,
  numberToMonetaryString,
  LoadingDots,
} from "@fluidity-money/surfing";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { useWeb3React } from "@web3-react/core";
import BN from "bn.js";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { SplitContext } from "contexts/SplitProvider";
import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import TokenSelect from "~/components/TokenSelect";

import { Asset } from "~/queries/useTokens";
import tokenAbi from "~/util/chainUtils/ethereum/Token.json";

import { getUsdFromTokenAmount, Token } from "~/util";
import serverConfig from "~/webapp.config.server";

export const loader: LoaderFunction = async ({ params }) => {
  const { network } = params;

  const { tokens: _tokens } =
    serverConfig.config[network as unknown as string] ?? {};

  const tokens = _tokens.filter((t) => t.isFluidOf);

  return json({
    tokens,
  });
};

export type AugmentedAsset = Asset & {
  userTokenBalance: BN;
};

const Send = () => {
  const fluidTokens: AugmentedAsset[] =
    useLoaderData<{
      tokens: Token[];
    }>().tokens.map((t) => {
      return {
        ...t,
        userTokenBalance: new BN(0),
        contract_address: t.address,
        is_fluid: true,
      };
    }) || [];

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const deeplinkAddress = searchParams.get("address");

  const deeplinkAssetToken = fluidTokens.find(
    (t) => t.symbol.toLowerCase() === token?.toLowerCase()
  );

  const { balance } = useContext(FluidityFacadeContext);

  const [tokens, setTokens] = useState<AugmentedAsset[]>(fluidTokens);

  useEffect(() => {
    if (!balance) return;

    (async () => {
      const promises = tokens.map(async (t: AugmentedAsset) => {
        const bal = await balance(t.contract_address);

        if (bal && bal.toNumber()) {
          console.log(t.name, bal.toString());

          setTokens((prev) =>
            prev.map((_t) => {
              if (_t.contract_address === t.contract_address) {
                return { ..._t, userTokenBalance: bal };
              }
              return _t;
            })
          );
        }
      });

      await Promise.all(promises);
    })();
  }, [balance]);

  const mobileWidthBreakpoint = 768;
  const { width } = useViewport();
  const isMobile = width < mobileWidthBreakpoint;

  // Select Your Asset
  const [selectedAsset, setSelectedAsset] = useState<
    AugmentedAsset | undefined
  >(deeplinkAssetToken);

  // Amount To Send
  const [amountToSend, setAmountToSend] = useState("");
  const [inputHint, setInputHint] = useState("");
  const [validAmount, setValidAmount] = useState(false);

  const handleAmountToSendChange = (s: string) => {
    const decimalRegex = /[^0-9.]+/g;
    const _s = s.replace(decimalRegex, "");

    const [whole, dec] = _s.split(".");

    const unpaddedWhole = whole === "" ? "" : parseInt(whole) || 0;

    if (dec === undefined) {
      return setAmountToSend(`${unpaddedWhole}`);
    }

    const limitedDecimals = dec.slice(0, 6);

    return setAmountToSend([whole, limitedDecimals].join("."));
  };

  useEffect(() => {
    if (!selectedAsset) return;
    const balanceNumber = getUsdFromTokenAmount(
      selectedAsset.userTokenBalance,
      selectedAsset.decimals,
      1
    );
    const amountRemaining = balanceNumber - +amountToSend;

    if (amountRemaining > 0) {
      if (+amountToSend > 0) {
        setValidAmount(true);
      } else {
        setValidAmount(false);
      }
      setInputHint(
        `${amountRemaining.toFixed(2)} ${selectedAsset.symbol
        } remaining (${numberToMonetaryString(amountRemaining)})`
      );
    } else {
      setValidAmount(false);
      setInputHint(`Insufficient ${selectedAsset.symbol} balance`);
    }
  }, [amountToSend, selectedAsset]);

  // Recipient Address
  const [recipientAddress, setRecipientAddress] = useState(
    deeplinkAddress || ""
  );
  const [validAddress, setValidAddress] = useState(false);
  const handleRecipientAddressChange = (s: string) => {
    const addressCharacterRegex = /[^0-9a-xA-F]*$/;
    const _s = s.replace(addressCharacterRegex, "");
    setRecipientAddress(_s);

    const addressRegex = /(0x[a-fA-F0-9]{40})/g;
    if (!s.match(addressRegex) || !ethers.utils.isAddress(s)) {
      setValidAddress(false);
    } else {
      setValidAddress(true);
    }
  };

  // Send
  const [canSend, setCanSend] = useState(false);
  useEffect(() => {
    if (!selectedAsset) return setCanSend(false);
    if (!validAddress) return setCanSend(false);
    if (!validAmount) return setCanSend(false);

    setCanSend(true);
  }, [
    selectedAsset,
    recipientAddress,
    amountToSend,
    validAddress,
    validAmount,
  ]);

  const { provider } = useWeb3React();
  const signer = provider?.getSigner();

  const handleSubmit = async () => {
    if (!selectedAsset) return;
    if (!signer) return;

    try {
      const txValue = ethers.utils.parseUnits(
        amountToSend,
        selectedAsset.decimals
      );
      const tokenContract = new ethers.Contract(
        selectedAsset.contract_address,
        tokenAbi,
        signer
      );
      const transferData = tokenContract.interface.encodeFunctionData(
        "transfer",
        [recipientAddress, txValue]
      );

      const tx = await signer.sendTransaction({
        to: selectedAsset.contract_address,
        data: transferData,
      });
      console.log("Transaction sent:", tx);
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };

  // Fees
  const [transactionFee, setTransactionFee] = useState("");

  useEffect(() => {
    if (!signer) return;
    if (!selectedAsset) return;

    (async () => {
      try {
        const txValue = ethers.utils.parseUnits(
          amountToSend,
          selectedAsset.decimals
        );
        const tokenContract = new ethers.Contract(
          selectedAsset.contract_address,
          tokenAbi,
          signer
        );

        const gasLimit = await tokenContract.estimateGas.transfer(
          recipientAddress,
          txValue
        );

        // Fetch the current gas price
        const gasPrice = await signer.getGasPrice();

        // Calculate the fee in gwei
        const fee = gasPrice.mul(gasLimit);

        setTransactionFee(ethers.utils.formatUnits(fee, "gwei"));
      } catch (error) {
        console.error("Error estimating fee:", error);
      }
    })();
  }, [selectedAsset, amountToSend, recipientAddress, signer]);

  const { showExperiment } = useContext(SplitContext);
  if (!showExperiment("enable-send-receive")) return <></>;

  return (
    <div className={`transfer-container send ${isMobile ? "mobile" : ""}`}>
      <Video
        className="send-video"
        src={"/videos/FluidityOpportunityB.mp4"}
        type={"none"}
        loop={true}
      />
      <div className="send-left">
        <Heading className="send-heading">Send Fluid Assets</Heading>
      </div>
      <div className="send-right">
        <div className="send-right-content">
          <Display size="xxs">Select your asset</Display>
          <TokenSelect
            assets={tokens}
            value={selectedAsset}
            onChange={(token) => {
              setSelectedAsset(token);
            }}
          />
          {selectedAsset && (
            <>
              <Display size="xxs">Sending details</Display>
              <Form.Group label="AMOUNT TO SEND" hint={inputHint}>
                <TokenIcon token={selectedAsset.symbol} height={"32"} />
                <Form.TextField
                  placeholder="0"
                  value={amountToSend}
                  onChange={handleAmountToSendChange}
                />
              </Form.Group>
              <Form.Group
                label="RECIPIENT ADDRESS"
                hint={!validAddress ? "Invalid address" : undefined}
              >
                <Form.TextField
                  value={recipientAddress}
                  onChange={handleRecipientAddressChange}
                />
                <GeneralButton
                  type="transparent"
                  size="small"
                  onClick={async () => {
                    await navigator.clipboard
                      .readText()
                      .then((text) => {
                        handleRecipientAddressChange(text || "");
                      })
                      .catch((err) => {
                        console.error(
                          "Failed to read clipboard contents: ",
                          err
                        );
                      });
                  }}
                >
                  PASTE
                </GeneralButton>
              </Form.Group>

              <Card
                type="transparent"
                border="solid"
                color="holo"
                className="send-table"
              >
                <Text className="send-table-header" prominent bold size="lg">
                  Potential Rewards
                </Text>
                <Text>Top prize</Text>
                <Text>{numberToMonetaryString(0)}</Text>
                <div className="rewards-table-rule" />
                <Text>Tier 2 prize</Text>
                <Text>{numberToMonetaryString(0)}</Text>
                <div className="rewards-table-rule" />
                <Text>Tier 3 prize</Text>
                <Text>{numberToMonetaryString(0)}</Text>
              </Card>
              <div className="send-table fees">
                <Text className="send-table-header" size="md">
                  Fees
                </Text>
                <Text>Network fee</Text>
                <Text>{numberToMonetaryString(0)}</Text>
                <div className="rewards-table-rule" />
                <Text>Gas fee</Text>
                <Text>
                  {transactionFee || (
                    <div style={{ transform: "scale(0.5)" }}>
                      <LoadingDots />
                    </div>
                  )}
                </Text>
              </div>
              <Text>
                Once sent, transactions cannot be reverted. By pressing send you
                agree to our{" "}
                <a
                  className="send-terms-link"
                  href="https://static.fluidity.money/assets/fluidity-website-tc.pdf"
                >
                  terms of service
                </a>
                .
              </Text>
              <GeneralButton
                type="primary"
                style={{ width: "100%", boxSizing: "border-box" }}
                onClick={() => {
                  handleSubmit();
                }}
                disabled={!canSend}
              >
                Send Assets
              </GeneralButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Send;
