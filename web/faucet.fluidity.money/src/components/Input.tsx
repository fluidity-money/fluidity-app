// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import styled from "styled-components";

import { Subtitle } from "./Titles";

export const Input = styled.input`
  font-family: "Poppins", sans-serif;
  color: white;
  background-color: #333333;
  border-radius: 43px;
  font-weight: 300;
  font-size: 17px;
  padding: 8px 12px;
  border-style: solid;
  border-color: transparent;
  box-sizing: border-box;
`;
/*:focus {
    border-style: solid;
    border-color: inherit;
  }*/

export const InputTweetAt = styled(Input)`
  border-radius: 0;
  border: 1px solid #ffffff;
  color: white;
`;

export const InputSubtitle = styled(Subtitle)`
  padding: 24px 4px 4px 4px;
`;
