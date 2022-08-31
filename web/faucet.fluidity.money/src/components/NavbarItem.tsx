// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.


import styled from "styled-components";

import Highlight from "./Highlight";

type NavbarItem = {
  text : string,
  href : string
};

const NavbarItem = ({ text, href } : NavbarItem) =>
  <Container>
    <Text><Highlight href={ href }>{ text }</Highlight></Text>
  </Container>;

const Container = styled.div`
  padding-left: 20px;
  padding-right: 20px;
  margin-top: auto;
  margin-bottom: auto;
`;

const Text = styled.h1`
  font-family: "Raleway", sans-serif;
  font-weight: 300;
  text-transform: uppercase;
  font-size: 16px;
  color: white;
`;

export default NavbarItem;
