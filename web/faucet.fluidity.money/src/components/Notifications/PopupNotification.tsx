// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import {useEffect} from "react";
import styled, {css, keyframes} from "styled-components";
import {Title} from "../Titles";

const ExclamationSvg = styled.svg`
  fill: url(#linearColorsRed);
  padding-right: 1rem;
  max-height: 2rem;
  min-width: 2rem;
`;
// licensed under creative commons cc0 1.0
// available at https://upload.wikimedia.org/wikipedia/commons/8/83/Error_%2889609%29_-_The_Noun_Project.svg
const exclamationSvg = <ExclamationSvg
   xmlns="http://www.w3.org/2000/svg"
   xmlnsXlink="http://www.w3.org/1999/xlink"
   version="1.1"
   x="0px"
   y="0px"
   viewBox="0 0 100 100"
   enable-background="new 0 0 100 100"
   xmlSpace="preserve">
     <linearGradient id="linearColorsRed" x1="0" y1="0" x2="1" y2="1">
         <stop offset="0%" stopColor="#91312C"></stop>
         <stop offset="100%" stopColor="#991d00"></stop>
     </linearGradient>
   <path d="M50,5C25.1,5,5,25.1,5,50c0,24.9,20.1,45,45,45c24.9,0,45-20.1,45-45C95,25.1,74.9,5,50,5L50,5z M55.6,77  c0,3.2-2.5,5.6-5.6,5.6c-3.1,0-5.5-2.5-5.5-5.6v-1.1c0-3.1,2.5-5.6,5.5-5.6c3.1,0,5.6,2.5,5.6,5.6V77z M58.3,26.3l-2.8,34.2  c-0.3,3.2-3,5.4-6.1,5.2c-2.8-0.2-4.9-2.5-5.1-5.2l-2.8-34.2c-0.5-4.5,3.7-8.9,8.2-8.9C54.7,17.4,58.7,21.8,58.3,26.3z" />
</ExclamationSvg>


const NotificationCheckmark = styled.path`
  display: block;
  height: 2rem;
  width: 2rem;
  border-radius: 50%;
  stroke-width: 2;
  stroke: #fff;
  stroke-miterlimit: 10;
  margin-right: 1rem;
  box-shadow: inset 0px 0px 0px #0eb88e;
  animation: fill .4s ease-in-out;
`;

const CheckSvg = styled.svg`
  fill: url(#linearColors);
  padding-right: 1rem;
  max-height: 2rem;
  min-width: 2rem;
`;

const checkSvg =
  <CheckSvg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 52 52"
  >
    {/* Circle gradient colour toggle*/}
    <linearGradient id="linearColors" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#16899B"></stop>
        <stop offset="100%" stopColor="#02F5A3"></stop>
    </linearGradient>
    <circle cx="26" cy="26" r="25" strokeWidth="0px">
    </circle>
    <NotificationCheckmark fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
  </CheckSvg>

const PopupNotification = ({isEnabled, remove, message, type}: {isEnabled: boolean, remove: (event?: unknown) => void, message: string, type: 'Error' | 'Check'}) => {
    useEffect(() => {
        // After 6 seconds, auto-dismiss
        if (isEnabled) {
            setTimeout(() => {
                remove();
            }, 6000);
        }
    }, [isEnabled]);

    return (
      <NotificationBody
        enabled={isEnabled}
        onClick={remove}
      >
        {type === 'Error' ? exclamationSvg : checkSvg}
        <div>
          {type === 'Error' && 
            <Title style={{fontSize: "1em"}}>Error!</Title>
          }
          <div>{message}</div>
        </div>
      </NotificationBody>
  )
}

interface NotificationBodyProps {
  enabled: boolean
}

const NotificationBody = styled.div<NotificationBodyProps>`
  position: relative;
  right: 0px;
  z-index: 9999;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: left;
  flex-direction: row;

  max-width: 25rem;
  @media (max-width: 712px) {
      width: 5rem;
  }
  @media (max-width: 300px) {
      font-size: 0.5rem;
  }
  padding: 1rem;
  margin-top: 0.5rem;

  border-radius: 1rem;
  // border: 2px solid #7daaa6;;
  // background-color: #1a1a1a;
  box-shadow: 0px 0px 4px 0px hsla(0, 0%, 0%, 0.5);

  transition: ease-in-out;
  cursor: pointer;

  font-family: "Poppins", Arial, Serif, sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0em;
  word-wrap: anywhere;

  color: white;
  background: #212429;

  animation: ${({enabled}) => enabled ?
  css`${slideIn} 1s forwards;` :
  css`${slideOut} 1s forwards`}
`;

const slideIn = keyframes`
  0% {
      opacity: 0;
      transform: translateX(100%);
  }

  100% {
      opacity: 1;
      transform: translateX(0%);
  }
`;

const slideOut = keyframes`
  0% {
      opacity: 1;
      transform: translateX(0%);
  }

  100% {
      opacity: 0;
      transform: translateX(50%);
  }
`;

export default PopupNotification
