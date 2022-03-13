
import styled from "styled-components";

import { RowOnDesktop, RowSpaceAround } from "./Row";
import { Subtitle } from "./Titles";
import Highlight from "./Highlight";
import SocialIcon from "./SocialIcon";

type Footer = {
  socialIcons : [string, string][],
  footerNavigationLinks : [string, string][]
};

const makeSocialIcons = (icons : [string, string][]) =>
  icons.map(([href, url] : [string, string]) =>
    <SocialIconContainer>
      <SocialIcon href={ href } src={ url } />
    </SocialIconContainer>);

const makeFooterGrid = (footerLinks : [string, string][]) =>
  footerLinks.map(([name, link]) =>
    <Highlight href={ link }>
      <SmallTitle>{ name }</SmallTitle>
    </Highlight>);

const FluidityLogo = () => <Logo src="/images/fluidity-logo.svg" />;

const Footer = ({ socialIcons, footerNavigationLinks }: Footer) =>
  <FooterContainer>
    <RowSpaceAround>
      <FooterItem>
        <FluidityLogo />
        <SmallTitle>
          <Highlight href="mailto:info@fluidity.money">
            info@fluidity.money
          </Highlight>
        </SmallTitle>
      </FooterItem>

      <FooterItem>
        <SocialIcons>
          { makeSocialIcons(socialIcons) }
        </SocialIcons>
        <SmallTitle>© 2021 Fluidity All Rights Reserved</SmallTitle>
      </FooterItem>

      <FooterItem>
        <FooterGrid>
          { makeFooterGrid(footerNavigationLinks) }
        </FooterGrid>
      </FooterItem>
    </RowSpaceAround>
  </FooterContainer>;

const FooterContainer = styled.div`
  background: #1A1A1A;
  width: 100%;
  position: absolute;
`;

const Logo = styled.img`
  @media (max-width: 768px) {
    width: 200px;
  }
`;

const SocialIconContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
`;

const SocialIcons = styled(RowOnDesktop)`
  display: flex;
  justify-content: center;
  flex-direction: row;

  @media not screen and (max-width: 768px) {
    > :nth-child(2) {
      margin-left: 20px;
      margin-right: 10px;
    }

    > :nth-child(3) {
      margin-left: 10px;
      margin-right: 20px;
    }
  }
`;

const SmallTitle = styled(Subtitle)`
  font-size: 16px;
  color: #FFFFFF
`;

const FooterItem = styled.div`
  margin-top: auto;
  margin-bottom: auto;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 100px 100px;
`;

export default Footer;
