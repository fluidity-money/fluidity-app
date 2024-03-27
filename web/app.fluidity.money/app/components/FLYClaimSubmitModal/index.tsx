
import { useContext, useState, useEffect } from "react";

import BN from "bn.js";

import FluidityFacadeContext from "contexts/FluidityFacade";
import { requestProof, RequestProofRes } from "~/queries/requestProof";

import { Heading, GeneralButton, Text } from "@fluidity-money/surfing";

import styles from "./styles.css";

export const FLYClaimSubmitModalLinks = () => [{ rel: "stylesheet", href: styles }];

type IFLYClaimSubmitModal = {
  visible: boolean;
  flyAmount: number;
  close: () => void;
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

const FLYClaimSubmitModal = ({ onComplete, onFailure, flyAmount }: IFLYClaimSubmitModal) => {
  const { address, signBuffer, merkleDistributorWithDeadlineClaim } = useContext(FluidityFacadeContext);

  const [currentStatus, setCurrentStatus] = useState(State.Disconnected);

  useEffect(() => {
    if (address && currentStatus == State.Disconnected)
      setCurrentStatus(State.IsConnected);
  }, [address]);

  const [currentProof, setProofData] = useState<RequestProofRes | null>(null);

  // needed for the signature effect hook
  const [signature, setSignature] = useState("");
  const [requestSignature, setRequestSignature] = useState(false);

  // needed for the request of the proof off-chain
  const [beginRequestProof, setBeginRequestProof] = useState(false);

  // needed to request the claim onchain, the amount to request
  const [requestAmount, setRequestAmount] = useState("");
  const [requestProofs, setRequestProofs] = useState<string[]>([]);

  const triggerMerkleClaim = async (index: number, amount_: string, proofs: string[]) => {
    console.log("about to trigger the merkle claim");
    if (!merkleDistributorWithDeadlineClaim) throw new Error("no deadline claim");
    if (!address) throw new Error("no address");
    console.log("merkle amount",  amount_);
    const amount = new BN(amount_.replace(/^0x/, ""), 16);
    console.log("about to trigger the merkle claimrrrr");
    await merkleDistributorWithDeadlineClaim(
      address,
      index,
      amount,
      proofs
    );
    console.log("done");
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
        // handle error here if something went wrong. time to submit the
        // proof data onchain. set this first
        setRequestAmount(amount);
        setRequestProofs(proofs);
        await triggerMerkleClaim(index, amount, proofs);
      } catch (err) {
        throw new Error(`failed to request proof: ${err}`);
      }
    })();
  }, [beginRequestProof]);

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
    // hit the stake contract using the collected data.
  };

  const handleClickButton = () => {
    console.error("current status", currentStatus);
    switch (currentStatus) {
    case State.Disconnected:
      // do nothing, option should be greyed out here
      break;
    case State.IsConnected:
      // time to sign!
      handleBeginSigning();
      break;
    case State.HasSigned:
      // time to begin the claim UX by submitting the current merkle
      // proof data that we have!
      handleBeginClaiming();
    case State.HasClaimed:
      // the user has claimed, time to connect them to the staking UX
      handleBeginStaking();
    case State.HasStaked:
      // do nothing, why is this being shown?
      break;
    case State.Broken:
      // something went wrong. prompt the user to reload the page.
      break;
    }
  };

  return (
    <div className="fly-submit-claim-modal-background">
      <div className="fly-submit-claim-modal-container">
        <div>
          <Heading as="h3">Claiming $FLY Tokens</Heading>
          <div className="fly-submit-claim-modal-options">
            <div className="fly-submit-claim-modal-row">
              <Heading as="h4">Connect your Arbitrum wallet</Heading>
            </div>
            <div className="fly-submit-claim-modal-row">
              <Heading as="h4">Sign Terms and Conditions</Heading>
            </div>
            <div className="fly-submit-claim-modal-row">
              <Heading as="h4">Claim $FLY {flyAmount}</Heading>
            </div>
            <div className="fly-submit-claim-modal-row">
              <Heading as="h4">Stake $FLY</Heading>
            </div>
          </div>
          <div className="fly-submit-claim-modal-button-container">
            <GeneralButton
              type="transparent"
              layout="after"
              handleClick={handleClickButton}
            >
              <Text size="sm" prominent code style={{ color: "inherit" }}>
                Sign
              </Text>
            </GeneralButton>
            <Text>
              By signing the following transactions, you agree to Fluidity Money’s Terms of Service and acknowledge that you have read and understand the Disclaimer.
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FLYClaimSubmitModal;
