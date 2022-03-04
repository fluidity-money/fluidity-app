import styled from "styled-components";
import {InputTweetAt, InputSubtitle} from "./Input";

type TestnetAccountAddressInput = {
  value?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
};

const TestnetAccountAddressInput =
  ({value, onChange} : TestnetAccountAddressInput) =>
  {

  return (
    <Container>
      <InputSubtitle>Testnet account address</InputSubtitle>
      <InputTweetAt
        onChange={onChange}
        placeholder="Ex: 0x0000000000000000000000000000" />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;

  > * {
    width: 100%;
  }
`;

export default TestnetAccountAddressInput;
