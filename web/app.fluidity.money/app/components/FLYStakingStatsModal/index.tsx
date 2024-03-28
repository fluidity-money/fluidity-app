import { Card, FlyIcon, GeneralButton, Heading, Hoverable, InfoCircle, LinkButton, Text, trimAddress, WarningIcon } from "@fluidity-money/surfing";
import { BN } from "bn.js";
import { FlyToken } from "contexts/EthereumProvider";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { useContext, useEffect, useState } from "react";
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
        setCurrentAction(isStaking ? "Stake" : "Claim")
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
                className={`fly-submit-claim-modal-container ${visible === true ? "show-fly-modal" : "hide-modal"
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
                        <div style={{ flexDirection: 'column' }} className="fly-submit-claim-modal-row">
                          <Text size="xxl" holo>{points}</Text>
                          <div className="text-with-info-popup">
                            <Hoverable
                              tooltipStyle={"frosted"}
                              tooltipContent={
                                <div className="flex-column">
                                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam non ligula eu lectus facilisis sollicitudin.
                                </div>
                              }
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                                <Text size="md">Your Cumulative Points</Text>
                                <InfoCircle />
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
                        <div className="fly-submit-claim-modal-row">
                        </div>
                        <div style={{ gap: '0.5em' }} className="fly-submit-claim-modal-row">
                          <Card fill>
                            <Hoverable
                              tooltipStyle={"frosted"}
                              tooltipContent={
                                <div className="flex-column">
                                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam non ligula eu lectus facilisis sollicitudin.
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
                                  <InfoCircle />
                                </div>
                              </div>
                            </Hoverable>
                          </Card>
                          <Card fill>
                            <Hoverable
                              tooltipStyle={"frosted"}
                              tooltipContent={
                                <div className="flex-column">
                                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam non ligula eu lectus facilisis sollicitudin.
                                </div>
                              }
                            >
                              <div className="flex-column">
                                <Text size="lg" prominent>{points}</Text>
                                <div className="text-with-info-popup">
                                  <Text size="lg">Staked</Text>
                                  <InfoCircle />
                                </div>
                              </div>
                            </Hoverable>
                          </Card>
                          <Card fill>
                            <Hoverable
                              tooltipStyle={"frosted"}
                              tooltipContent={
                                <div className="flex-column">
                                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam non ligula eu lectus facilisis sollicitudin.
                                </div>
                              }
                            >
                              <div className="flex-column">
                                <Text size="lg" prominent>{pointsUnstaking}</Text>
                                <div className="text-with-info-popup">
                                  <Text size="lg">Unstaking</Text>
                                  <InfoCircle />
                                </div>
                              </div>
                            </Hoverable>
                          </Card>
                        </div>
                      </>
                      :
                      currentStatus === State.StakingDetails ?
                        <div className="fly-submit-claim-modal-options">
                          <div className="fly-submit-claim-modal-row">
                            {!isStaking ? "un" : ""}staking details
                          </div>
                        </div> :


                        <div className="fly-submit-claim-modal-options">
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
                            className={`fly-submit-claim-action-button`}
                          >
                            <Text size="md" bold className="fly-submit-claim-action-button-text">
                              <WarningIcon />
                              Stake
                            </Text>
                          </GeneralButton>
                          <GeneralButton
                            type="primary"
                            size="large"
                            layout="after"
                            handleClick={() => handleClick(false)}
                            className={`fly-submit-claim-action-button`}
                          >
                            <Text size="md" bold className="fly-submit-claim-action-button-text">
                              <WarningIcon />
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
                          className={`fly-submit-claim-action-button ${currentStatus === State.HasStaked - 1 ? "rainbow" : ""} ${currentStatus === State.HasStaked ? "claim-button-staked" : ""}`}

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

export {
  FlyStakingStatsModal
}
