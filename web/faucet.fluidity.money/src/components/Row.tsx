import styled from "styled-components";

export const RowOnDesktop = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px;
  }
`;

export const RowCentered = styled(RowOnDesktop)`
  justify-content: center;
`;

export const RowSpaceAround = styled(RowOnDesktop)`
  justify-content: space-around;
  @media (max-width: 768px) {
    align-items: center;
  }
`;

export const RowOnInput = styled(RowOnDesktop)`
  justify-content: space-between;
  @media (max-width: 768px) {
    align-items: center;
  }
`;
