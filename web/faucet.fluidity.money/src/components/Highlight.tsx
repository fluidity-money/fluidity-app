// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import styled from "styled-components";

const Highlight = styled.a`
  text-decoration: none;
  color: inherit;

  @media (max-width: 768px) {
    :hover {
      border-bottom-style: solid;
      border-bottom-color: white;
    }
  }
`;

export default Highlight;
