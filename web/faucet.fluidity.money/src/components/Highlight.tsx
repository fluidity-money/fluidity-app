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
