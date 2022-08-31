// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

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
