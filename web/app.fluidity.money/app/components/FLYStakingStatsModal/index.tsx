import { Card, FlyIcon, GeneralButton, Heading, Hoverable, InfoCircle, LinkButton, StakeIcon, Text, trimAddress, UnstakeIcon, WarningIcon } from "@fluidity-money/surfing";
import { BN } from "bn.js"; import { FlyToken } from "contexts/EthereumProvider";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { ReactNode, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "~/styles/dashboard/airdrop.css";
import { BaseCircle, Checked, NextCircle, TermsModal } from "../FLYClaimSubmitModal";

export const FlyStakingStatsModalLinks = () => [{ rel: "stylesheet", href: styles }];

interface FlyStakingStatsModalProps {
  visible: boolean
  showConnectWalletModal: () => void;
  close: () => void;
  // true for staking, false for unstaking
  staking?: boolean
  points: number | string
  pointsUnstaking: number | string
}

enum State {
  // Base screen
  Stats,
  // Entering amount
  StakingDetails,
  // Awaiting Connection
  AmountEntered,
  // Awaiting signature
  IsConnected,
  // Awaiting staking confirmation
  HasSigned,
  // Finished
  HasStaked
}

const FlyStakingStatsModal = ({ visible, close, showConnectWalletModal, staking = true, points, pointsUnstaking }: FlyStakingStatsModalProps) => {
  const [modal, setModal] = useState<React.ReactPortal | null>(null);
  const { balance, address, addToken } = useContext(FluidityFacadeContext)

  const [flyBalance, setFlyBalance] = useState(new BN(0))

  useEffect(() => {
    balance?.(FlyToken.address).then(result => setFlyBalance(result || new BN(0)))
  }, [balance])


  const [isStaking, setIsStaking] = useState(staking)
  const [currentStatus, setCurrentStatus] = useState(State.Stats)
  const [currentAction, setCurrentAction] = useState("Connect")
  const [showTermsModal, setShowTermsModal] = useState(false)

  useEffect(() => {
    if (address && (currentStatus === State.AmountEntered))
      setCurrentStatus(State.IsConnected);
  }, [address, currentStatus]);

  useEffect(() => {
    console.error("current status", currentStatus);
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
        setCurrentAction("Sign")
        break;
      case State.HasSigned:
        setCurrentAction(isStaking ? "Stake" : "Claim")
        break;
      case State.HasStaked:
        setCurrentAction(isStaking ? "Staked!" : "Unstaked")
        break;
    }

  }, [currentStatus])

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
        setCurrentStatus(State.HasSigned);
        break;
      case State.HasSigned:
        setIsStaking(staking);
        setCurrentStatus(State.HasStaked);
        break;
      case State.HasStaked:
        break;
    }
  }

  useEffect(() => {
    setModal(
      createPortal(
        <>
          <div
            className={`fly-submit-claim-outer-modal-container ${visible === true ? "show-fly-modal" : "hide-modal"
              }`}
          >
            <div className="fly-submit-claim-modal-background">
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
                    <span onClick={close}>
                      <img src="/images/icons/x.svg" className="modal-cancel-btn" />
                    </span>
                  </div>
                  <div className="fly-submit-claim-modal-options">
                    {currentStatus === State.Stats ?
                      <>
                        <div style={{ flexDirection: 'column', gap: 0 }} className="fly-submit-claim-modal-row">
                          <Text size="xxl" style={{fontSize: "3.25em"}} holo>{points}</Text>
                          <div className="text-with-info-popup">
                            <Hoverable
                              tooltipStyle={"solid"}
                              tooltipContent={
                                <div className="flex-column">
                                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam non ligula eu lectus facilisis sollicitudin.
                                </div>
                              }
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                                <Text size="md">Your Cumulative Points</Text>
                                <InfoCircle className="info-circle-grey"/>
                              </div>
                            </Hoverable>
                          </div>
                        </div>
                        <div className="fly-submit-claim-modal-row">
                          <Card border="solid" fill>
                            <Text style={{ textAlign: 'center' }} size="lg" prominent>
                              💸 Stake your $FLY to earn Airdrop Rewards and [REDACTED] in Superposition (SPN) 🐱
                            </Text>
                          </Card>
                        </div>
                        <div style={{ gap: '0.5em' }} className="fly-submit-claim-modal-row">
                          <Card fill>
                            <Hoverable
                              tooltipStyle={"solid"}
                              tooltipContent={
                                <div className="flex-column">
                                  The amount of $FLY Token you have claimed.
                                </div>
                              }
                            >
                              <div className="flex-column">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                                  <FlyIcon />
                                  <Text size="lg" prominent>{flyBalance.toString()}</Text>
                                </div>
                                <div className="text-with-info-popup">
                                  <Text size="lg">$FLY Balance</Text>
                                <InfoCircle className="info-circle-grey"/>
                                </div>
                              </div>
                            </Hoverable>
                          </Card>
                          <Card fill>
                            <Hoverable
                              tooltipStyle={"solid"}
                              tooltipContent={
                                <div className="flex-column">
                                  The amount of $FLY Token you have staked from your total $FLY Balance.
                                </div>
                              }
                            >
                              <div className="flex-column">
                                <Text size="lg" prominent>{points}</Text>
                                <div className="text-with-info-popup">
                                  <Text size="lg">Staked</Text>
                                <InfoCircle className="info-circle-grey"/>
                                </div>
                              </div>
                            </Hoverable>
                          </Card>
                          <Card fill>
                            <Hoverable
                              tooltipStyle={"solid"}
                              tooltipContent={
                                <div className="flex-column">
                                  The amount of $FLY Tokens you have unstaked from your total Staked $FLY Balance. Includes unbonding amount.
                                </div>
                              }
                            >
                              <div className="flex-column">
                                <Text size="lg" prominent>{pointsUnstaking}</Text>
                                <div className="text-with-info-popup">
                                  <Text size="lg">Unstaking</Text>
                                <InfoCircle className="info-circle-grey"/>
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
                            <div className="fly-submit-claim-modal-row">
                              <StakingWarning
                                header={
                                  <Text size="lg" bold prominent style={{ color: 'black' }}>Staking will lock up your funds for <span className="underline">7 Days</span>.</Text>
                                }
                                body={
                                  <Text size="md" style={{ color: 'black' }}>To have access to your staked funds once again, you must go through the process of unstaking</Text>

                                } />
                            </div>
                            :
                            <>
                              <div className="fly-submit-claim-modal-row">
                                <StakingWarning
                                  header={
                                    <Text size="lg" bold prominent style={{ color: 'black' }}>Access to the tokens will be <span className="underline">granted in 7 Days</span>.</Text>
                                  }
                                  body={
                                    <Text size="md" style={{ color: 'black' }}>During this period, you will be unable to receive staking rewards and terminate the un-bonding process.</Text>

                                  } />
                              </div>
                              <div className="fly-submit-claim-modal-row">
                                <StakingWarning
                                  header={
                                    <Text size="lg" bold prominent style={{ color: 'black' }}>Unstaking will result in the loss of some points.</Text>
                                  }
                                  body={
                                    <Text size="md" style={{ color: 'black' }}>You wll lose the equivalent percentage of unstaked $FLY from your accumulative points. <Text size="md" style={{ color: 'black' }} bold>(i.e: Unstaking 50% of $FLY will result in 50% Loss of points)</Text></Text>

                                  } />
                              </div>
                            </>
                          }
                          <div className="fly-submit-claim-modal-row">
                            <div className="flex-column" style={{ width: '100%' }}>
                              <Text prominent size="lg">AMOUNT OF $FLY TO STAKE</Text>
                              <div className="staking-input-underline">
                                <FlyIcon />
                                <input
                                  className="staking-input"
                                  min={""}
                                  // value={swapInput}
                                  // onBlur={(e) =>
                                  //   setSwapInput(
                                  //     addDecimalToBn(
                                  //       snapToValidValue(e.target.value),
                                  //       assetToken.decimals
                                  //     )
                                  //   )
                                  // }
                                  // onChange={handleChangeSwapInput}
                                  placeholder="0"
                                  step="any"
                                />
                                <Text>${0} USD</Text>
                              </div>
                              <div className="staking-input-lower">
                                {0} $FLY remaining (={0})
                                <div onClick={() => {/*set max*/ }}>
                                  <Text prominent size="md" className="underline" style={{ cursor: 'pointer', textUnderlineOffset: '2px' }}>Max</Text>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Text style={{ marginTop: '1em' }}>Once approved, transactions cannot be reverted. By pressing send you agree to our {" "}
                            <a
                              className="link"
                              onClick={() => { setShowTermsModal(true) }}
                            >
                              staking terms and conditions
                            </a>.</Text>
                        </div> :


                        <div className="fly-submit-claim-modal-options">
                          {currentStatus === State.AmountEntered && <div className="fly-submit-claim-modal-row">
                            <div className="flex-column" style={{ gap: '1em' }}>
                              <div style={{ display: 'flex' }}>
                                <Text size="lg" prominent>🏄🏼‍♂️</Text>
                                <Text size="lg" holo>Staking $FLY will reward you points.</Text>
                              </div>
                              <div className="fly-caution-border">
                                <Text size="lg" prominent>
                                  You will earn {points} points by staking your $FLY. Stake your $FLY to earn Airdrop Rewards and [REDACTED] in Superposition (SPN).
                                </Text>
                              </div>
                            </div>
                          </div>
                          }
                          <div className="fly-submit-claim-modal-row">
                            {currentStatus <= State.AmountEntered
                              ? <NextCircle /> : <Checked />}
                            <div className="flex-column">
                              <Text size="lg" prominent>Connect your Arbitrum wallet</Text>
                              {State.IsConnected && address && <Text size="md" >Connected {trimAddress(address)}</Text>}
                            </div>
                          </div>
                          <div className="fly-submit-claim-modal-row">
                            {currentStatus === State.AmountEntered ?
                              <BaseCircle /> :
                              currentStatus === State.IsConnected ?
                                <NextCircle /> :
                                <Checked />
                            }
                            <div className="flex-column">
                              <Text size="lg" prominent>Sign Terms and Conditions</Text>
                              <Text size="md">Read{" "}
                                <a
                                  className="link"
                                  onClick={() => setShowTermsModal(true)}
                                >
                                  Terms and Conditions
                                </a>
                              </Text>
                            </div>
                          </div>
                          <div className="fly-submit-claim-modal-row">
                            {currentStatus < State.HasSigned ?
                              <BaseCircle /> :
                              currentStatus === State.HasSigned ?
                                <NextCircle /> :
                                <Checked />
                            }
                            <div className="flex-column">
                              <Text size="lg" prominent>{isStaking ? "Stake" : "Unstake"} $FLY {flyBalance.toString()}</Text>
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
                          disabled={currentStatus === State.HasStaked}
                          handleClick={() => handleClick(isStaking)}
                          className={`fly-staking-stats-action-button ${currentStatus === State.HasStaked - 1 ? "rainbow" : ""} ${currentStatus === State.HasStaked ? "claim-button-staked" : ""}`}

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
          </div>
        </>,
        document.body
      )
    );

  }, [visible, currentStatus, isStaking, currentAction, showTermsModal, isStaking])

  return modal;
}

const StakingWarning = ({ header, body }: { header: ReactNode, body: ReactNode }) => {
  return <Card style={{ backgroundColor: "#FFD362", gap: '1em' }}>
    <div style={{ display: 'flex', alignItems: 'end', gap: '0.5em' }}>
      <WarningIcon />
      {header}
    </div>
    {body}
  </Card>
}

export {
  FlyStakingStatsModal
}
