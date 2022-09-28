// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { Title, Subtitle } from "../components/Titles";
import { RowOnDesktop } from "../components/Row";
import NetworkInput, { CurrencyInput } from "../components/NetworkInput";
import Highlight from "../components/Highlight";
import TestnetAccountAddressInput from "../components/TestnetAccountAddressInput";
import { notificationContext } from "../components/Notifications/notificationContext";
import { formatTweet } from "../util/tweet";
import { handleUniquePhraseRequest, SupportedNetworks } from "../util";

import { SendRequestButton } from "../components/Buttons";
import { NetworkInputOptions } from "../App";

type RequestFaucet = {
  networkInputOptions: NetworkInputOptions;
};

const ContactEmail = () => {
  const email = "contact@fluidity.money";

  return (
    <FaucetHighlightEmail href={`mailto:${email}`}>
      {email}
    </FaucetHighlightEmail>
  );
};

const RequestFaucet = ({ networkInputOptions }: RequestFaucet) => {
  const [chosenNetworkName, setChosenNetworkName] =
    useState<SupportedNetworks>("ethereum");

  const chosenNetwork = networkInputOptions[chosenNetworkName];

  const [networkFullName, networkDefaultAddress, airdropTokenList] =
    chosenNetwork;
  const [airdropTokenName, setAirdropTokenName] = useState<
    typeof airdropTokenList[number]
  >(airdropTokenList[0]);

  useEffect(() => {
    // set to first when changing networks
    setAirdropTokenName(airdropTokenList[0]);
  }, [airdropTokenList]);

  const [account, setAccount] = useState("");
  const [twitterText, setTwitterText] = useState("");

  const { addError, addNotification } = useContext(notificationContext);

  const addTwitterNotification = (phrase: string) => {
    if (!twitterText) {
      setTwitterText(phrase);
      window.open(formatTweet(phrase, chosenNetworkName, airdropTokenName));
      return;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addNotification("Copied to clipboard!");
  };

  let tweetAtMessage =
    "Follow the process below to tweet and receive your Fluid Assets! Shortly after tweeting, your funds will be sent to you automatically.";

  if (twitterText)
    tweetAtMessage =
      "You will be given a unique ID and the ability to request funds from the faucet once every 24 hours, per token.";

  return (
    <Container>
      <InformationContainer>
        <Title>Request Testnet {airdropTokenName}!</Title>
        <FaucetLineContainer>
          <FaucetLine />
        </FaucetLineContainer>
        <SubtitleContainer>
          <Subtitle>
            Tweet a unique code provided here at @fluiditymoney with
            #fluiditymoney to get free {airdropTokenName} on {networkFullName}!
          </Subtitle>
        </SubtitleContainer>
      </InformationContainer>

      <TweetAtContainer>
        <form>
          <TweetAtRows>
            <TweetAtSubtitle highlight={!!twitterText}>
              {tweetAtMessage}
            </TweetAtSubtitle>
            <InputsRow>
              <NetworkInput
                options={networkInputOptions}
                value={chosenNetworkName}
                onChange={(e) =>
                  setChosenNetworkName(e.target.value as SupportedNetworks)
                }
              />
              <TestnetAccountAddressInput
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                defaultAddress={networkDefaultAddress}
              />
            </InputsRow>
            <InputsRow>
              <CurrencyInput
                options={airdropTokenList}
                value={airdropTokenName}
                onChange={(e) =>
                  setAirdropTokenName(
                    e.target.value as typeof airdropTokenList[number]
                  )
                }
              >
                <PhraseContainer
                  enabled={!!twitterText}
                  onClick={() => twitterText && copyToClipboard(twitterText)}
                >
                  {twitterText && (
                    <>
                      Your unique ID: <PhraseText>{twitterText}</PhraseText>
                    </>
                  )}
                </PhraseContainer>
              </CurrencyInput>
            </InputsRow>
            <SendRequestContainer>
              <RowOnDesktop>
                <SendRequestButton
                  type="button"
                  onClick={() =>
                    handleUniquePhraseRequest(
                      chosenNetworkName,
                      account,
                      airdropTokenName,
                      addError,
                      addNotification,
                      addTwitterNotification
                    )
                  }
                >
                  {twitterText ? "Request Funds" : "Request Code"}
                </SendRequestButton>
              </RowOnDesktop>
            </SendRequestContainer>

            <EmailUsAtContainer>
              <EmailUsSubtitle>
                Email us at <ContactEmail /> if there is an issue here, thanks!
              </EmailUsSubtitle>
            </EmailUsAtContainer>
          </TweetAtRows>
        </form>
      </TweetAtContainer>
    </Container>
  );
};

const Container = styled.div`
  padding-top: 60px;

  @media not screen and (max-width: 768px) {
    padding-left: 80px;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const InformationContainer = styled.div`
  max-width: 710px;
  padding-bottom: 40px;
  padding-right: 20px;
`;

const TweetAtRows = styled.div`
  @media not screen and (max-width: 768px)
    > :not(:last-child) {
      padding-left: 20px;
      pading-top: 40px;
    }
  }
`;

const TweetAtContainer = styled.div`
  background: rgba(36, 44, 48, 0.7);
  max-width: 1200px;

  @media not screen and (max-width: 768px) {
    padding: 40px;
    padding-right: 120px;
    padding-bottom: 20px;
  }
`;

const ClickToTweetContainer = styled.div`
  padding-left: 10px;
  padding-right: 10px;
`;

const SendRequestContainer = styled.div`
  padding-top: 30px;
`;

const InputsRow = styled(RowOnDesktop)`
  @media not screen and (max-width: 768px) {
    > :nth-child(2) {
      padding-left: 40px;
      width: 100%;
    }
  }
`;

const EmailUsAtContainer = styled.div`
  padding-top: 40px;
`;

const FaucetLineContainer = styled.div`
  @media not screen and (max-width: 768px) {
    padding-top: 5px;
    padding-bottom: 30px;
    padding-left: 90px;
  }
`;

const FaucetLine = styled.div`
  background: linear-gradient(79.44deg, #1881fe 36.64%, #5bfef3 70.33%);
  width: 300px;
  height: 3px;
  border-radius: 30px;
`;

const SubtitleContainer = styled.div`
  @media (max-width: 768px) {
    padding-top: 30px;
  }
`;

const FaucetHighlightEmail = styled(Highlight)``;

const EmailUsSubtitle = styled(Subtitle)`
  font-size: 16px;
`;

const PhraseText = styled.span``;

const PhraseContainer = styled(Subtitle)<{ enabled?: boolean }>`
  ${({ enabled }) =>
    enabled &&
    `
    flex: 1;
    padding: 0;
    text-align: center;
    margin: auto;

    :hover {
      ${PhraseText} {
        text-decoration: underline;
      }
      cursor: pointer;
    }`}
`;

const TweetAtSubtitle = styled(Subtitle)<{ highlight?: boolean }>`
  transition: color 0.1s;
  ${({ highlight }) =>
    highlight &&
    `
    color: green;
  `}
`;

export default RequestFaucet;
