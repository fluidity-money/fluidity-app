import { Card, FlyIcon, GeneralButton, Heading, Hoverable, InfoCircle, LinkButton, StakeIcon, Text, trimAddress, UnstakeIcon, WarningIcon } from "@fluidity-money/surfing";
import { BigNumber } from "ethers";
import BN from "bn.js";
import { FlyToken } from "contexts/EthereumProvider";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "~/styles/dashboard/airdrop.css";
import { BaseCircle, Checked, NextCircle, TermsModal } from "../FLYClaimSubmitModal";
import { addDecimalToBn, snapToValidValue } from "~/util/chainUtils/tokens";

export const FlyStakingStatsModalLinks = () => [{ rel: "stylesheet", href: styles }];

interface FlyStakingStatsModalProps {
  visible: boolean
  showConnectWalletModal: () => void;
  close: () => void;
  // true for staking, false for unstaking
  staking?: boolean;
  shouldUpdateFlyBalance: number;
}

enum State {
  // Base screen
  Stats,
  // Entering amount
  StakingDetails,
  // Awaiting Connection
  AmountEntered,
  // Awaiting staking
  IsConnected,
  // Finished
  HasStaked,
  // Error occured
  InError
}

const getValueFromFlyAmount = (amount: BN) => {
  const x = amount.toString();
  switch (true) {
  case (x.length > 6):
    return (() => {
      const leftSide = x.slice(0, x.length - 6);
      const rightSide = x.slice(x.length - 6).slice(0, 3);
      return `${leftSide}.${rightSide}`;
    })();
  case (x.length < 6):
    return `0.${x}`;
  }
};

const FlyStakingStatsModal = ({ visible, close, showConnectWalletModal, shouldUpdateFlyBalance, staking = true }: FlyStakingStatsModalProps) => {

  const [modal, setModal] = useState<React.ReactPortal | null>(null);

  const {
    balance,
    address,
    addToken,
    flyStakingStake,
    flyStakingDetails,
    flyStakingBeginUnstake,
    flyStakingAmountUnstaking,
  } = useContext(FluidityFacadeContext)

  const [flyBalance, setFlyBalance] = useState(new BN(0));

  const closeWithEsc = useCallback(
    (event: { key: string }) => {
      event.key === "Escape" && visible === true && handleClose();
    },
    [visible]
  );

  useEffect(() => {
    document.addEventListener("keydown", closeWithEsc);
    return () => document.removeEventListener("keydown", closeWithEsc);
  }, [visible]);

  const [currentStatus, setCurrentStatus] = useState(State.Stats);

  useEffect(() => {
    (async () => {
      try {
        if (!balance) return;
        const bal = await balance(FlyToken.address);
        if (!bal) return;
        setFlyBalance(bal);
      } catch (err) {
        console.error("error fly balance", err);
        setErrorMessage(`Failed to get FLY balance! ${err}`);
        setCurrentStatus(State.InError);
      }
    })();
  }, [balance, shouldUpdateFlyBalance]);

  const [points, setPoints] = useState(BigNumber.from(0));
  const [flyStaked, setFlyStaked] = useState(BigNumber.from(0));

  useEffect(() => {
    (async () => {
      try {
        if (!address) return;
        if (!flyStakingDetails) return;
        const details = await flyStakingDetails(address);
        if (!details) {
          console.error("couldnt get fly staking details");
          return;
        }
        const { flyStaked, points } = details;
        setPoints(points);
        setFlyStaked(flyStaked);
        console.log("fly staked 123", flyStaked);
      } catch (err) {
        console.error("error staking details", err);
        setErrorMessage(`Failed to get staking details! ${err}`);
        setCurrentStatus(State.InError);
      }
    })();
  }, [address, flyStakingDetails, shouldUpdateFlyBalance]);

  const [flyUnstaking, setFlyUnstaking] = useState(new BN(0));

  useEffect(() => {
    (async () => {
      try {
        if (!address) return;
        if (!flyStakingAmountUnstaking) return;
        const unstaking = await flyStakingAmountUnstaking(address);
        if (!unstaking) return;
        setFlyUnstaking(unstaking);
      } catch (err) {
        console.error("error getting unstaking details", err);
        setErrorMessage(`Failed to get unstaking amount! ${err}`);
        setCurrentStatus(State.InError);
      }
    })();
  }, [address, flyStakingAmountUnstaking]);

  const [isStaking, setIsStaking] = useState(staking)
  const [currentAction, setCurrentAction] = useState("Connect")
  const [showTermsModal, setShowTermsModal] = useState(false)

  useEffect(() => {
    if (address && (currentStatus === State.AmountEntered))
      setCurrentStatus(State.IsConnected);
  }, [address, currentStatus]);

  useEffect(() => {
    switch (currentStatus) {
      case State.Stats:
        setCurrentAction("")
        break;
      case State.StakingDetails:
        setCurrentAction(isStaking ? "Stake" : "Unstake")
        break;
      case State.AmountEntered:
        setCurrentAction("Connect")
        break;
      case State.IsConnected:
        setCurrentAction(isStaking ? "Stake" : "Claim")
        break;
      case State.HasStaked:
        setCurrentAction(isStaking ? "Staked!" : "Unstaked")
        break;
    }

  }, [currentStatus]);

  const handleClose = () => {
    close();
    setCurrentStatus(State.Stats);
  };

  const handleClick = (staking: boolean) => {
    switch (currentStatus) {
      case State.Stats:
        setIsStaking(staking);
        setCurrentStatus(State.StakingDetails);
        break;
      case State.StakingDetails:
        setIsStaking(staking);
        setCurrentStatus(State.AmountEntered);
        break;
      case State.AmountEntered:
        setIsStaking(staking);
        showConnectWalletModal()
        break;
      case State.IsConnected:
        setIsStaking(staking);
        beginStakeInteraction();
        break;
      case State.HasStaked:
        break;
    }
  }

  const setMaxBalance = () => {
    if (isStaking) {
      setSwapInput(
        addDecimalToBn(
          snapToValidValue(
            flyBalance.toString(),
            FlyToken,
            flyBalance,
          ),
          FlyToken.decimals
        )
      );
    } else {
      setSwapInput(
        addDecimalToBn(
          snapToValidValue(
            flyStaked.toString(),
            FlyToken,
            new BN(flyStaked.toString())
          ),
          FlyToken.decimals
        )
      );
    }
  };

  const [swapInput, setSwapInput] = useState("");

  const stakeAmount: BN = snapToValidValue(swapInput, FlyToken, flyBalance);

  const unstakeAmount: BN = snapToValidValue(swapInput, FlyToken, new BN(flyStaked.toString()));

  // kicks off the interaction to begin the staking via the contract
  const [beginStaking, setBeginStaking] = useState(false);

  // error message to be displayed above the claim button
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!flyStakingStake) return;
    if (!beginStaking) return;
    (async () => {
      try {
        isStaking ?
          await flyStakingStake(stakeAmount) :
          await flyStakingBeginUnstake?.(stakeAmount);
        setCurrentStatus(State.HasStaked);
        // if the user is staking, add to their staked amount, if not, take
        isStaking ?
          setFlyStaked(flyStaked.add(stakeAmount.toString())) :
          setFlyStaked(flyStaked.sub(stakeAmount.toString()));
        setFlyBalance(flyBalance.sub(stakeAmount));
      } catch (err) {
        console.error("error fly staking", err);
        setErrorMessage(`Failed to begin staking! ${err}`);
        setCurrentStatus(State.InError);
      }
    })();
  }, [flyStakingStake, beginStaking]);

  const beginStakeInteraction = () => {
    setBeginStaking(true);
  };

  const handleChangeSwapInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const tokenDecimals = 6
    // if (/^\d*\.?\d*$/.test(e.currentTarget.value))
    //   setSwapInput(e.target.value);
    const numericChars = e.target.value.replace(/[^0-9.]+/, "");

    const [whole, dec] = numericChars.split(".");

    const unpaddedWhole = whole === "" ? "" : parseInt(whole) || 0;

    if (dec === undefined) {
      return setSwapInput(`${unpaddedWhole}`);
    }

    const limitedDecimals = dec.slice(0 - tokenDecimals);

    return setSwapInput([whole, limitedDecimals].join("."));
  };

  useEffect(() => {
    setModal(
      createPortal(
        <>
          <div
            className={`fly-submit-claim-outer-modal-container ${visible === true ? "show-fly-modal" : "hide-modal"
              }`}
          >
            <div onClick={close} className="fly-submit-claim-modal-background"></div>
              <div
                className={`fly-staking-stats-modal-container ${visible === true ? "show-fly-modal" : "hide-modal"
                  }`}
              >
                <div className="fly-submit-claim-flex-container">
                  <div className="fly-submit-claim-heading-container">
                    <Heading as="h3" className="fly-submit-claim-heading">
                      {currentStatus === State.Stats ?
                        "Your Staking Stats" :
                        currentStatus === State.StakingDetails ?
                          `${isStaking ? "Staking" : "Unstaking"} details` :
                          `${isStaking ? "Staking" : "Unstaking"} $FLY Tokens`
                      }
                    </Heading>
                    <span onClick={handleClose}>
                      <img src="/images/icons/x.svg" className="modal-cancel-btn" />
                    </span>
                  </div>
                  <div className="fly-submit-claim-modal-options">
                    {currentStatus === State.Stats ?
                      <>
                        <div className="flex-column no-gap fly-staking-stats-modal-row">
                          <Text size="xxxl" holo>{points.toString()}</Text>
                          <div className="text-with-info-popup">
                            <Hoverable
                              tooltipStyle={"solid"}
                              tooltipContent={
                                <div className="flex-column">
                                  <Text className="staking-stats-info-text">
                                    <a
                                      href="https://blog.fluidity.money/introducing-the-fluidity-governance-token-fly-0992cfbf921e"
                                      rel="noopener noreferrer"
                                    >
                                      More info available here
                                    </a>
                                  </Text>
                                </div>
                              }
                            >
                              <div className="text-with-info-popup">
                                <Text size="md">Your Cumulative Points</Text>
                                <InfoCircle className="info-circle-grey" />
                              </div>
                            </Hoverable>
                          </div>
                        </div>
                        <div className="fly-staking-stats-modal-row">
                          <Card border="solid" fill>
                            <Text className="center-text" size="lg" prominent>
                              💸 Stake your $FLY to earn Airdrop Rewards and [REDACTED] in Superposition (SPN) 🐱
                            </Text>
                          </Card>
                        </div>
                        <div style={{ gap: '0.5em' }} className="fly-staking-stats-modal-row">
                          <Card fill>
                            <Hoverable
                              tooltipStyle={"solid"}
                              tooltipContent={
                                <div className="flex-column">
                                  <Text className="staking-stats-info-text">
                                    The amount of $FLY Token you have claimed.
                                  </Text>
                                </div>
                              }
                            >
                              <div className="flex-column">
                                <div className="text-with-info-popup">
                                  <FlyIcon />
                                  <Text size="lg" prominent>{getValueFromFlyAmount(flyBalance)?.toString()}</Text>
                                </div>
                                <div className="text-with-info-popup">
                                  <Text size="lg">$FLY Balance</Text>
                                  <InfoCircle className="info-circle-grey" />
                                </div>
                              </div>
                            </Hoverable>
                          </Card>
                          <Card fill>
                            <Hoverable
                              tooltipStyle={"solid"}
                              tooltipContent={
                                <div className="flex-column">
                                  <Text className="staking-stats-info-text">
                                    The amount of $FLY Token you have staked from your total $FLY Balance.
                                  </Text>
                                </div>
                              }
                            >
                              <div className="flex-column">
                                <Text size="lg" prominent>{
                                  (() => {
                                    const s = getValueFromFlyAmount(new BN(flyStaked.toString()))?.toString();
                                    if (!s) return flyStaked.toString();
                                    return s;
                                  })() }</Text>
                                <div className="text-with-info-popup">
                                  <Text size="lg">Staked</Text>
                                  <InfoCircle className="info-circle-grey" />
                                </div>
                              </div>
                            </Hoverable>
                          </Card>
                          <Card fill>
                            <Hoverable
                              tooltipStyle={"solid"}
                              tooltipContent={
                                <div className="flex-column">
                                  <Text className="staking-stats-info-text">
                                    The amount of $FLY Tokens you have unstaked from your total Staked $FLY Balance. Includes unbonding amount.
                                  </Text>
                                </div>
                              }
                            >
                              <div className="flex-column">
                                <Text size="lg" prominent>{getValueFromFlyAmount(flyUnstaking)?.toString()}</Text>
                                <div className="text-with-info-popup">
                                  <Text size="lg">Unstaking</Text>
                                  <InfoCircle className="info-circle-grey" />
                                </div>
                              </div>
                            </Hoverable>
                          </Card>
                        </div>
                      </>
                      :
                      currentStatus === State.StakingDetails ?
                        <div className="fly-submit-claim-modal-options">
                          {isStaking ?
                            <div className="fly-staking-stats-modal-row">
                              <StakingWarning
                                header={
                                  <Text size="lg" bold prominent className="black">Staking will lock up your funds for <span className="underline">7 Days</span>.</Text>
                                }
                                body={
                                  <Text size="md" className="black">To have access to your staked funds once again, you must go through the process of unstaking</Text>

                                } />
                            </div>
                            :
                            <>
                              <div className="fly-staking-stats-modal-row">
                                <StakingWarning
                                  header={
                                    <Text size="lg" bold prominent className="black">Access to the tokens will be <span className="underline">granted in 7 Days</span>.</Text>
                                  }
                                  body={
                                    <Text size="md" className="black">During this period, you will be unable to receive staking rewards and terminate the un-bonding process.</Text>

                                  } />
                              </div>
                              <div className="fly-staking-stats-modal-row">
                                <StakingWarning
                                  header={
                                    <Text size="lg" bold prominent className="black">Unstaking will result in the loss of some points.</Text>
                                  }
                                  body={
                                    <Text size="md" className="black">You will lose the equivalent percentage of unstaked $FLY from your accumulative points. <Text size="md" className="black" bold>(i.e: Unstaking 50% of $FLY will result in 50% Loss of points)</Text></Text>

                                  } />
                              </div>
                            </>
                          }
                          <div className="fly-staking-stats-modal-row">
                            <div className="fly-staking-input-container">
                              <Text prominent size="lg">AMOUNT OF $FLY TO {isStaking ? "STAKE" : "UNSTAKE"}</Text>
                              <div className="staking-input-underline">
                                <FlyIcon />
                                <input
                                  className="staking-input"
                                  min={""}
                                  value={swapInput}
                                  onChange={handleChangeSwapInput}
                                  placeholder="0"
                                  step="any"
                                />
                              </div>
                              <div className="staking-input-lower">
                                {isStaking ?
                                  `${getValueFromFlyAmount(flyBalance.sub(stakeAmount))} $FLY remaining` :
                                  `${getValueFromFlyAmount(new BN(flyStaked.toString()).sub(unstakeAmount))} $FLY staked remaining`}
                                <div className="flex" style={{gap: '0.5em'}}>
                                  <Text size="md">Staking {getValueFromFlyAmount(stakeAmount)} $FLY</Text>
                                  <div onClick={setMaxBalance}>
                                    <Text prominent size="md" className="max-balance-text">Max</Text>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Text className="fly-once-approved">Once approved, transactions cannot be reverted. By pressing send you agree to our {" "}
                            <a
                              className="link"
                              onClick={() => { setShowTermsModal(true) }}
                            >
                              staking terms and conditions
                            </a>.</Text>
                        </div> :


                        <div className="fly-submit-claim-modal-options">
                          {currentStatus <= State.IsConnected && <div className="fly-staking-stats-modal-row">
                            <div className="fly-points-info-container">
                              <div className="flex">
                                <Text size="lg" prominent>🏄🏼‍♂️</Text>
                                <Text size="lg" holo>Staking $FLY will reward you points.</Text>
                              </div>
                            </div>
                          </div>
                          }
                          <div className="fly-staking-stats-modal-row">
                            {currentStatus <= State.AmountEntered
                              ? <NextCircle /> : <Checked />}
                            <div className="flex-column">
                              <Text size="lg" prominent>Connect your Arbitrum wallet</Text>
                              {State.IsConnected && address && <Text size="md" >Connected {trimAddress(address)}</Text>}
                            </div>
                          </div>
                          <div className="fly-staking-stats-modal-row">
                            {currentStatus < State.HasStaked ? <BaseCircle /> : <Checked />}
                            <div className="flex-column">
                              <Text size="lg" prominent>{isStaking ? "Stake" : "Unstake"} $FLY {getValueFromFlyAmount(stakeAmount)}</Text>
                              {
                                currentStatus >= State.HasStaked && (
                                  isStaking ?
                                    <Text size="md">Earn rewards & [REDACTED] on SPN</Text> :
                                    <LinkButton
                                      size={"medium"}
                                      type={"external"}
                                      handleClick={() => { addToken?.("FLY") }}
                                    >
                                      Add $FLY to My Wallet
                                    </LinkButton >
                                )
                              }
                            </div>
                          </div>
                        </div>
                    }
                  </div>
                  <Text className={currentStatus === State.InError ? "claim-error-message" : "claim-error-message-none"}>{ errorMessage }</Text>
                  <div className="fly-submit-claim-modal-button-container">
                    <div className="fly-confirming-claim-button-container">
                      {currentStatus === State.Stats ?
                        <>
                          <GeneralButton
                            type="primary"
                            size="large"
                            layout="after"
                            handleClick={() => handleClick(true)}
                            className={`fly-staking-stats-action-button`}
                          >
                            <Text size="md" bold className="fly-submit-claim-action-button-text">
                              <StakeIcon />
                              Stake
                            </Text>
                          </GeneralButton>
                          <GeneralButton
                            type="primary"
                            size="large"
                            layout="after"
                            handleClick={() => handleClick(false)}
                            className={`fly-staking-stats-action-button`}
                          >
                            <Text size="md" bold className="fly-submit-claim-action-button-text">
                              <UnstakeIcon />
                              Unstake
                            </Text>
                          </GeneralButton>
                        </> :
                        <GeneralButton
                          type="primary"
                          size="large"
                          layout="after"
                          disabled={currentStatus === State.HasStaked || (isStaking ? stakeAmount.eq(new BN(0)) : unstakeAmount.eq(new BN(0)))}
                          handleClick={() => handleClick(isStaking)}
                          className={`fly-staking-stats-action-button ${currentStatus === State.HasStaked - 1 ? "rainbow" : ""} ${currentStatus === State.HasStaked ? "claim-button-staked" : ""} ${currentStatus === State.InError ? "claim-button-error" : ""}`}

                        >
                          <Text size="md" bold className="fly-submit-claim-action-button-text">
                            {currentAction}
                            {currentStatus === State.HasStaked && <Checked size={18} />}
                          </Text>
                        </GeneralButton>

                      }
                    </div>

                  </div>
                  <Text size="xs" className="legal">
                    By signing the following transactions, you agree to Fluidity Money&apos;services{" "}
                    <a
                      className="link"
                      href="https://static.fluidity.money/assets/fluidity-website-tc.pdf"
                    >
                      Terms of Service
                    </a>{" "}
                    and acknowledge that you have read and understand the{" "}
                    <a className="link">Disclaimer</a>
                  </Text>
                  <TermsModal visible={showTermsModal} close={() => setShowTermsModal(false)} />
                </div>
              </div>
          </div>
        </>,
        document.body
      )
    );

  }, [
    visible,
    currentStatus,
    isStaking,
    currentAction,
    showTermsModal,
    points,
    flyUnstaking,
    swapInput
  ])

  return modal;
}

const StakingWarning = ({ header, body }: { header: ReactNode, body: ReactNode }) => {
  return <Card className="staking-card" >
    <div className="staking-card-container">
      <WarningIcon />
      {header}
    </div>
    {body}
  </Card>
}

export {
  FlyStakingStatsModal
}
