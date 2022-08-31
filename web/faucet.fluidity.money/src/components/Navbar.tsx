// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import styled from "styled-components";
import { RowOnDesktop } from "./Row";
import NavbarItem from "./NavbarItem";
import BurgerNavbar from "./BurgerNavbar";
import React from "react";

type Navbar = {
  items: [string, string][];
};

const makeNavbarItems = (items: [string, string][]) =>
  items.map(([name, href]) => <NavbarItem text={name} href={href} />);

const Navbar = ({ items }: Navbar) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Container>
      <Children>
        <Left>
          <FluidityLogo src="/images/logo.svg" />
        </Left>
        <Right>
          <RowOnDesktop>{makeNavbarItems(items)}</RowOnDesktop>
        </Right>
        <NavMenuMobile open={open}>{makeNavbarItems(items)}</NavMenuMobile>
        <BurgerNavbar open={open} setOpen={setOpen} />
      </Children>
    </Container>
  );
};

const Container = styled.div`
  padding-top: 60px;
  padding-bottom: 60px;
  margin-left: auto;
  margin-right: auto;
  max-width: 1200px;
  @media (max-width: 768px) {
    padding-top: 20px;
    padding-bottom: 20px;
  }
`;

const Children = styled(RowOnDesktop)`
  justify-content: space-between;
  @media (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    padding: 0 20px 0 20px;
  }
`;

const FluidityLogo = styled.img`
  @media (max-width: 425px) {
    width: 260px;
  }
`;

const Left = styled.div``;

const Right = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

interface MobileMenuProps {
  open: boolean;
}

const NavMenuMobile = styled.div<MobileMenuProps>`
  position: absolute;
  top: 65px;
  right: 0px;
  background-color: rgba(29, 29, 29, 0.85);
  transition: transform 0.3s ease-in-out;
  transform: ${({ open }) => (open ? "translateX(0)" : "translateX(100%)")};
  @media (min-width: 768px) {
    display: none;
  }
`;

export default Navbar;
