
import styled from "styled-components";

import { RowOnDesktop } from "./Row";
import NavbarItem from "./NavbarItem";

type Navbar = {
  items : [string, string][]
};

const makeNavbarItems = (items: [string, string][]) =>
  items.map(([name, href]) => <NavbarItem text={ name } href={ href }/>);

const Navbar = ({ items }: Navbar) =>
  <Container>
    <Children>
      <Left>
        <img src="/images/logo.svg" />
      </Left>
      <Right>
        <RowOnDesktop>
          { makeNavbarItems(items) }
        </RowOnDesktop>
      </Right>
    </Children>
  </Container>;

const Container = styled.div`
  padding-top: 60px;
  padding-bottom: 60px;
  margin-left: auto;
  margin-right: auto;
  max-width: 1200px;
`;

const Children = styled(RowOnDesktop)`
  justify-content: space-between;
`;

const Left = styled.div`
  @media (max-width: 768px) {
    margin-left: auto;
    margin-right: auto;
  }
`;

const Right = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

export default Navbar;
