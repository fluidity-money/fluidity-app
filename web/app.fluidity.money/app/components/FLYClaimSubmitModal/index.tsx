
import { useContext, useState, useEffect, useCallback } from "react";

import BN from "bn.js";

import FluidityFacadeContext from "contexts/FluidityFacade";
import { requestProof } from "~/queries/requestProof";

import { Heading, GeneralButton, Text, trimAddress, LinkButton, Modal, WarningIcon } from "@fluidity-money/surfing";

import styles from "~/styles/dashboard/airdrop.css";
import { createPortal } from "react-dom";

export const FLYClaimSubmitModalLinks = () => [{ rel: "stylesheet", href: styles }];

type IFLYClaimSubmitModal = {
  visible: boolean;
  flyAmount: number;
  accumulatedPoints: number;
  mode: 'stake' | 'claim';
  close: () => void;
  showConnectWalletModal: () => void;
  onComplete: (amountClaimed: number) => void;
  onFailure: (errorMessage: string) => void
};

enum State {
  Disconnected,
  IsConnected,
  HasSigned,
  HasClaimed,
  HasStaked,
  Broken
}

const BlobData = `By completing the transaction of this Airdrop you acknowledge that
(a) you are not the subject of economic or trade sanctions administered or enforced by any governmental authority or otherwise designated on any list of prohibited or restricted parties (including the list maintained by the Office of Foreign Assets Control of the U.S. Department of the Treasury) (collectively, "Sanctioned Person").

(b) You do not intend to transact with any restricted person or sanctioned person as defined by the Office of Foreign Assets of the U.S Department of the Treasury; and

(c) You do not, and will not, use a VPN or any other privacy or anonymization tools or techniques to circumvent, or attempt to circumvent, any restrictions that apply to the Services.

You may not be eligible to receive the digital assets or a select class and type of digital assets from an Airdrop in your jurisdiction.

You acknowledge that you are not a resident of the following countries listed below. You further acknowledge and accept that the countries listed below have deemed crypto and/or digital assets as illegal;

*Afghanistan, Algeria, Egypt, Bangladesh, Bolivia, Burundi, Cameroon, Chad, China, Republic of Congo, Ethiopia, Gabon, Iraq, Lesotho, Libya, Macedonia, Morocco, Myanmar, Nepal, Qatar, Sierra Leone, Tunisia **

To the best of our understanding, below is a list of countries that either are excluded due to ongoing regulatory concerns and or are subject to any sanctions administered or enforced by any country, government or international authority;

*United States of America or Canada, the People's Republic of China, Cuba, North Korea, Timor-Leste, Cambodia, Republic of the Union of Myanmar, Lao People's Democratic Republic, Tanzania, Pakistan, Uganda, Mali, Afghanistan, Albania, Angola, Botswana, Chad, Central African Republic, Eritrea, the Republic of Guinea, Guinea-Bissau, Somalia, Zimbabwe, Democratic Republic of the Congo, Republic of the Congo, Ethiopia, Malawi, Mozambique, Madagascar, Crimea, Kyrgyzstan, Haiti, Bosnia and Herzegovina, Uzbekistan, Turkmenistan, Burundi, South Sudan, Sudan (north), Sudan (Darfur), Nicaragua, Vanuatu, the Republic of North Macedonia, the Lebanese Republic, Bahamas, Kosovo, Iran, Iraq, Liberia, Libya, Syrian Arab Republic, Tajikistan, Uzbekistan, Yemen, Belarus, Bolivia, Venezuela, the regions of Crimea, Donetsk, Kherson, Zaporizhzhia or Luhansk.*

Kindly be advised that this list is for reference only and you are advised to seek independent legal advise as to your eligibility to receive the assets through Airdrop.

**source - Library of Congress, Atlantic Council, Techopedia, Finder, Triple-A, Chainalysis*`;

// TODO add a check for their state if they close and re-open the modal
// TODO fail state for when they've already claimed/staked
const FLYClaimSubmitModal = ({
  // onComplete,
  // onFailure,
  flyAmount,
  visible,
  showConnectWalletModal,
  close,
  accumulatedPoints,
  mode
}: IFLYClaimSubmitModal) => {

  const {
    address,
    signBuffer,
    addToken,
    merkleDistributorWithDeadlineClaim,
    merkleDistributorWithDeadlineClaimAndStake,
  } = useContext(FluidityFacadeContext);

  const closeWithEsc = useCallback(
    (event: { key: string }) => {
      event.key === "Escape" && visible === true && close();
    },
    [visible]
  );

  useEffect(() => {
    document.addEventListener("keydown", closeWithEsc);
    return () => document.removeEventListener("keydown", closeWithEsc);
  }, [visible]);

  const flyAmountFirstTranche = flyAmount / 4;

  const [currentMode, setCurrentMode] = useState(mode)
  const [finalState, setFinalState] = useState(currentMode === 'claim' ? State.HasClaimed : State.HasStaked)

  useEffect(() => {
    setFinalState(currentMode === 'claim' ? State.HasClaimed : State.HasStaked)
  }, [finalState])

  const [modal, setModal] = useState<React.ReactPortal | null>(null);

  const [currentStatus, setCurrentStatus] = useState(State.Disconnected);
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [confirmingClaim, setConfirmingClaim] = useState(mode === 'claim')

  useEffect(() => {
    if (address && (currentStatus === State.Disconnected))
      setCurrentStatus(State.IsConnected);
  }, [address]);

  const [currentAction, setCurrentAction] = useState("Connect")

  useEffect(() => {
    switch (currentStatus) {
      case State.Disconnected:
        setCurrentAction("Connect")
        break;
      case State.IsConnected:
        setCurrentAction("Sign")
        break;
      case State.HasSigned:
        setCurrentAction("Claim")
        break;
      case State.HasClaimed:
        setCurrentAction(currentMode === "claim" ? "Claimed!" : "Stake")
        break;
      case State.HasStaked:
        setCurrentAction("Staked!")
        break;
    }

  }, [currentStatus])

  // needed for the signature effect hook
  const [signature, setSignature] = useState("");
  const [requestSignature, setRequestSignature] = useState(false);

  // needed for the request of the proof off-chain
  const [beginRequestProof, setBeginRequestProof] = useState(false);

  // needed to request the claim onchain, the amount to request
  // const [requestAmount, setRequestAmount] = useState("");
  // const [requestProofs, setRequestProofs] = useState<string[]>([]);

  const triggerMerkleClaim = async (index: number, amount_: string, proofs: string[]) => {
    if (!address) throw new Error("no address");
    const amount = new BN(amount_.replace(/^0x/, ""), 16);
    try {
      switch (currentMode) {
        case "stake":
          if (!merkleDistributorWithDeadlineClaimAndStake)
            throw new Error("no deadline claim/stake");

          await merkleDistributorWithDeadlineClaimAndStake(
            address,
            index,
            amount,
            proofs
          );
          break;
        case "claim":
          if (!merkleDistributorWithDeadlineClaim)
            throw new Error("no deadline claim");

          await merkleDistributorWithDeadlineClaim(
            address,
            index,
            amount,
            proofs
          );
          break;
      }
    } catch (err) {
      console.error("error staking/claiming", err);
    }
  };

  useEffect(() => {
    if (!signBuffer)
      throw new Error("couldn't sign");
    if (!requestSignature)
      return;
    (async () => {
      const sig = await signBuffer(BlobData);
      if (!sig) throw new Error("couldn't bubble up sig");
      setSignature(sig);
      setCurrentStatus(State.HasSigned);
    })();
  }, [requestSignature]);

  useEffect(() => {
    if (!address) return;
    if (!beginRequestProof) return;
    (async () => {
      try {
        const {
          index,
          amount,
          proofs,
          error
        } = await requestProof(address, signature);

        if (!index) throw new Error(`amount not returned, err: ${error}`);
        // setRequestAmount(amount);
        // setRequestProofs(proofs);
        await triggerMerkleClaim(index, amount, proofs);
        setCurrentStatus(State.HasClaimed);
      } catch (err) {
        console.error("the big fuck", err);
        throw new Error(`failed to request proof: ${err}`);
      }
    })();
  }, [address, beginRequestProof]);

  const handleBeginSigning = () => {
    // prompt the user to sign the blob that we're using for verifying
    // accent to the terms. using the api, request the state that we can
    // use to log that they agreed, and store it using a state here.
    // colour a part of the UI while setting the state to broken to
    // set how it went.
    setRequestSignature(true);
  };

  const handleBeginClaiming = () => {
    // send the collected payload from the api to onchain via the claim
    // functionality.
    setBeginRequestProof(true);
  };

  const handleBeginStaking = () => {
    // hit the stake contract using the collected data. presuming stake is
    // the current mode.
    setBeginRequestProof(true);
  };

  const handleClickButton = () => {
    switch (currentStatus) {
      case State.Disconnected:
        // prompt wallet connection
        showConnectWalletModal()
        break;
      case State.IsConnected:
        // time to sign!
        handleBeginSigning();
        break;
      case State.HasSigned:
        // time to begin the claim UX by submitting the current merkle
        // proof data that we have!
        switch (currentMode) {
          case "claim":
            handleBeginClaiming();
            break;
          case "stake":
            handleBeginStaking();
            break;
        }
        break;
      case State.HasClaimed:
        // do nothing!
        break;
      case State.HasStaked:
        // do nothing, why is this being shown?
        break;
      case State.Broken:
        // something went wrong. prompt the user to reload the page.
        break;
    }
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
                className={`fly-submit-claim-modal-container ${visible === true ? "show-fly-modal" : "hide-modal"
                  }`}
              >
                <div className="fly-submit-claim-flex-container">
                  <div className="fly-submit-claim-heading-container">
                    <Heading as="h3" className="fly-submit-claim-heading">{currentMode === 'claim' ? "Claiming" : "Staking"} $FLY Tokens</Heading>
                    <span onClick={close}>
                      <img src="/images/icons/x.svg" className="modal-cancel-btn" />
                    </span>
                  </div>
                  {confirmingClaim ?
                    <div className="fly-confirming-claim-container">
                      <div className="fly-confirming-claim-header">
                        <WarningIcon />
                        <Text size="lg" prominent className="fly-caution-text">Caution. Claiming $FLY will cease your points.</Text>
                      </div>
                      <div className="fly-caution-border">
                        <Text size="lg" prominent>You have accumulated {accumulatedPoints} points. In order to retain your accumulated points, you must initially stake your $FLY. Otherwise, you may claim your $FLY and stake it at a later stage without the accumulated points.</Text>
                      </div>
                      <Text size="lg" prominent className="fly-caution-centre-text">Do you wish to continue claiming?</Text>
                    </div> :
                    <div className="fly-submit-claim-modal-options">
                      <div className="fly-submit-claim-modal-row">
                        {currentStatus === State.Disconnected
                          ? <NextCircle /> : <Checked />}
                        <div className="flex-column">
                          <Text size="lg" prominent>Connect your Arbitrum wallet</Text>
                          {State.IsConnected && address && <Text size="md" >Connected {trimAddress(address)}</Text>}
                        </div>
                      </div>
                      <div className="fly-submit-claim-modal-row">
                        {currentStatus === State.Disconnected ?
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
                      {currentMode === "claim" && <div className="fly-submit-claim-modal-row">
                        {currentStatus < State.HasSigned ?
                          <BaseCircle /> :
                          currentStatus === State.HasSigned ?
                            <NextCircle /> :
                            <Checked />
                        }
                        <div className="flex-column">
                          <Text size="lg" prominent>Claim $FLY {flyAmountFirstTranche}</Text>
                          {currentStatus >= State.HasClaimed &&
                            <LinkButton
                              size={"medium"}
                              type={"external"}
                              handleClick={() => { addToken?.("FLY") }}
                            >
                              Add $FLY to My Wallet
                            </LinkButton>
                          }
                        </div>
                      </div>}
                      {currentMode === 'stake' && <div className="fly-submit-claim-modal-row">
                        {currentStatus < State.HasClaimed ?
                          <BaseCircle /> :
                          currentStatus === State.HasClaimed ?
                            <NextCircle /> :
                            <Checked />
                        }
                        <div className="flex-column">
                          <Text size="lg" prominent>Stake $FLY</Text>
                          <Text size="md">Earn rewards & [REDACTED] on SPN</Text>
                        </div>
                      </div>
                      }
                    </div>
                  }
                  <div className="fly-submit-claim-modal-button-container">
                    {confirmingClaim ?
                      <div className="fly-confirming-claim-button-container">
                        <GeneralButton
                          type="primary"
                          size="large"
                          layout="after"
                          handleClick={() => setConfirmingClaim(false)}
                          className="fly-claim-stake-choice-button"

                        >
                          <Text size="md" prominent bold className="fly-continue-claiming-text">
                            Continue Claiming
                          </Text>
                        </GeneralButton>
                        <GeneralButton
                          type="primary"
                          size="large"
                          layout="after"
                          handleClick={() => {
                            setConfirmingClaim(false);
                            setCurrentMode('stake')
                          }}
                          className="fly-claim-stake-choice-button"

                        >
                          <Text size="md" bold prominent className="stake-your-fly-text">
                            Stake Your $FLY
                          </Text>
                        </GeneralButton>
                      </div>
                      :
                      <>
                        <GeneralButton
                          type="primary"
                          size="large"
                          layout="after"
                          disabled={currentStatus === finalState}
                          handleClick={handleClickButton}
                          className={`fly-submit-claim-action-button ${currentStatus === finalState - 1 ? "rainbow" : ""} ${currentStatus === finalState ? "claim-button-staked" : ""}`}

                        >
                          <Text size="md" bold className="fly-submit-claim-action-button-text">
                            {currentAction}
                            {currentStatus === finalState && <Checked size={18} />}
                          </Text>
                        </GeneralButton>
                      </>
                    }
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
  }, [visible, currentStatus, currentAction, showTermsModal, confirmingClaim]);

  return modal;
};

export const Checked = ({ size = 36 }: { size?: number }) => {
  return <img className='fly-submit-claim-circle' height={size} width={size} src="/images/icons/checked.svg" alt="copy" />
}

export const BaseCircle = () => {
  return <div style={{ width: '36px', height: '36px' }}>
    <svg height="100%" stroke="#696A68" strokeWidth="5px" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" />
    </svg>
  </div>

}
export const NextCircle = () => {
  return <div style={{ width: '36px', height: '36px' }}>
    <svg height="100%" stroke="white" strokeWidth="5px" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" />
    </svg>
  </div>

}

type TermsModalProps = {
  visible: boolean
  close: () => void
}

export const TermsModal = ({ visible, close }: TermsModalProps) => {

  return <Modal
    id="terms-and-conditions"
    visible={visible}
  >
    <div className="airdrop-terms-and-conditions-modal-container" style={{ zIndex: 10 }}>
      <div className="airdrop-terms-and-conditions-modal-child">
        <div className="airdrop-terms-and-conditions-modal-navbar">
          <GeneralButton
            size="medium"
            handleClick={close}
          >
            Close
          </GeneralButton>
        </div>
        <p>
          1. Description

          We may offer you the opportunity to receive some digital assets at no cost (**Airdrop**), subject to the terms described in this section. The Airdrop is delivered by us to you, but may be manufactured, offered and supported by the network creator or developer, if any, and not by us.
        </p>
        <p>
          1. Terms of Airdrop Program

          2.1 No Purchase Necessary

          There is no purchase necessary to receive the Airdrop. However, you must have
          wallets recognised and accepted by us. Although we do not charge a fee for participation in the Airdrop Program, we reserve the right to do so in the future and shall provide prior notice to you in such case.
        </p>
        <p>
          2.2 Timing

          Each Airdrop may be subject to any additional terms and conditions and where applicable such terms and conditions shall be displayed and marked with an asterisk (*) or other similar notation.
        </p>
        <p>
          2.3 Limited Supply

          An offer to receive the digital assets in an Airdrop is only available to you while supplies last. Once the amount of digital asset offered by us in an Airdrop is exhausted, any party who
          has either been placed on a waitlist, or has completed certain additional steps, but not yet received notice of award of the asset in such Airdrop, shall no longer be eligible to receive the said digital assets in that Airdrop. We reserve the right, in our sole discretion, to modify or
          suspend any Airdrop requirements at any time without notice, including the amount previously
          advertised as available.
        </p>
        <p>
          2.4 Eligibility

          You may not be eligible to receive the digital assets or a select class and type of digital assets from an Airdrop in your jurisdiction.

          To the best of our understanding, below is a list of countries that does not recognise digital assets;

          *Afghanistan, Algeria, Egypt, Bangladesh, Bolivia, Burundi, Cameroon, Chad, China, Republic of Congo, Ethiopia, Gabon, Iraq, Lesotho, Libya, Macedonia, Morocco, Myanmar, Nepal, Qatar, Sierra Leone, Tunisia **

          Kindly be advised that this list is for reference only and you are advised to seek independent legal advise as to your eligibility to receive the assets through Airdrop.

          **source - Library of Congress, Atlantic Council, Techopedia, Finder, Triple-A, Chainalysis*
        </p>
        <p>

          2.5 Notice of Award

          In the event you are selected to receive the digital asset in an Airdrop, we shall notify you of the pending delivery of such asset. Eligibility may be limited as to time.
          We are not liable to you for failure to receive any notice associated with the Airdrop Program.
        </p>
        <p>

          3 Risk Disclosures Relating to Airdrop Program

          You are solely responsible for researching and understanding the Fluid Assets token and it’s related utility and/or network  subject to the Airdrop.
        </p>
      </div>
    </div>
  </Modal>
}

export default FLYClaimSubmitModal;
