import styled from "styled-components";

import { RowOnDesktop, RowSpaceAround } from "./Row";
import { Subtitle } from "./Titles";
import Highlight from "./Highlight";
import SocialIcon from "./SocialIcon";

type socialIcons = [string, string][];
type footerNavigationLinks = [string, string][];

const navLinks: socialIcons = [
  ["Home", "https://fluidity.money/#home"],
  ["About", "https://fluidity.money/#about"],
  ["Docs", "https://docs.fluidity.money/"],
  ["Blog", "https://fluidity.money/#blog"],
  ["Whitepapers", "https://fluidity.money/#whitepapers"],
];

const socialLinks: footerNavigationLinks = [
  ["https://twitter.com/fluiditymoney", "/images/twitter.svg"],
  ["https://discord.gg/CNvpJk4HpC", "/images/discord.svg"],
  ["https://www.linkedin.com/company/fluidity-money/", "/images/linkedin.svg"],
  ["https://t.me/fluiditymoney", "/images/telegram.svg"],
];

const makeSocialIcons = (icons: [string, string][]) =>
  icons.map(([href, url]: [string, string]) => (
    <SocialIconContainer>
      <SocialIcon href={href} src={url} />
    </SocialIconContainer>
  ));

const makeFooterGrid = (footerLinks: [string, string][]) =>
  footerLinks.map(([name, link]) => (
    <Highlight href={link}>
      <SmallTitle>{name}</SmallTitle>
    </Highlight>
  ));

const FluidityLogo = () => <Logo src="/images/fluidity-logo.svg" />;

const Footer = () => (
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
        <SocialIcons>{makeSocialIcons(socialLinks)}</SocialIcons>
        <SmallTitle>© 2021 Fluidity All Rights Reserved</SmallTitle>
      </FooterItem>

      <FooterItem>
        <FooterGrid>{makeFooterGrid(navLinks)}</FooterGrid>
      </FooterItem>
    </RowSpaceAround>
  </FooterContainer>
);

const FooterContainer = styled.div`
  background: rgba(29, 29, 29, 0.7);
  width: 100%;
  position: absolute;
  padding-top: 20px;
  padding-bottom: 20px;
`;

const Logo = styled.img`
  @media (max-width: 140px) {
    width: 140px;
  }
  width: 140px;
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
  font-size: 12px;
  color: #ffffff;
`;

const FooterItem = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 100px 100px;

  @media (max-width: 768px) {
    grid-template-columns: 100px 100px 100px;
    text-align: center;
  }
`;

export default Footer;
