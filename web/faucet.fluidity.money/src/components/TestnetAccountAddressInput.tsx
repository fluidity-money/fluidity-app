import styled from "styled-components";
import {InputTweetAt, InputSubtitle} from "./Input";

type TestnetAccountAddressInput = {
  value?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  defaultAddress: string
};

const TestnetAccountAddressInput =
  ({value, onChange, defaultAddress} : TestnetAccountAddressInput) =>

  <Container>
    <InputSubtitle>Testnet account address</InputSubtitle>
    <InputTweetAt
      onChange={onChange}
      placeholder={`Ex: ${defaultAddress}`} />
  </Container>;

const Container = styled.div`
  width: 100%;

  > * {
    width: 100%;
  }
`;

export default TestnetAccountAddressInput;
