
import styled from "styled-components";

export const SubmitButton = styled.button`
  border-style: solid;
  border-color: #5BFEF3;
  color: white;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  background-color: #333333;
  border-radius: 43px;
  font-size: 16px;
  padding: 12px 40px;
  transition: all 0.2s;

  :hover {
    cursor: pointer;
  }

  :disabled {
    border-color: #333333;
    cursor: not-allowed;
    color: #444444;
  }
`;

export const SendRequestButton = styled.button`
  font-family: "Raleway", sans-serif;
  border-style: solid;
  color: white;
  font-weight: 500;
  background: #5519FE;
  font-size: 14px;
  height: fit-content;
  padding: 12px 40px;
  text-transform: uppercase;
  border-radius: 20px;
  transition: all 0.2s;
  cursor: pointer;

  :disabled {
    background: #8E8E8E;
    color: black;
    cursor: not-allowed;
  }
`;

export const ClickToTweetButton = styled.a`
  font-family: "Raleway", sans-serif;
  border-style: solid;
  color: white;
  font-weight: 500;
  background: rgb(29, 161, 242);
  font-size: 14px;
  height: fit-content;
  padding: 12px 40px;
  text-transform: uppercase;
  border-radius: 20px;
  transition: all 0.2s;
  appearance: button;
  text-decoration: none;
`;
