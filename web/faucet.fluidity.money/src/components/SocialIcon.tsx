import styled from "styled-components";

import Highlight from "./Highlight";

type SocialIcon = {
  href: string;
  src: string;
};

const SocialIcon = ({ href, src }: SocialIcon) => (
  <Highlight href={href}>
    <Image src={src} />
  </Highlight>
);

const Image = styled.img`
  width: 35px;
  height: 35px;
  filter: invert(1);
  @media (max-width: 768px) {
    margin: 5px;
  }
`;

export default SocialIcon;
