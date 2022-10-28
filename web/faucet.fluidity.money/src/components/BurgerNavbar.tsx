// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import React, { Dispatch, SetStateAction } from "react";
import styled from "styled-components";

interface Props {
  open: boolean;
}

const StyledBurger = styled.div<Props>`
  display: none;
  @media (max-width: 768px) {
    width: 2.5rem;
    height: 2.5rem;
    padding-bottom: 10px;
    background-color: none;
    display: flex;
    justify-content: space-around;
    flex-direction: column;

    div {
      width: 2.5rem;
      height: 0.25rem;
      background-color: white;
      border-radius: 1rem;
      transform-origin: 1px;
      transition: all 0.4s linear;

      &: nth-child(1) {
        transform: ${({ open }) => (open ? "rotate(45deg)" : "rotate(0)")};
      }

      &: nth-child(2) {
        transform: ${({ open }) =>
          open ? "translateX(100%)" : "translateX(0)"};
        opacity: ${({ open }) => (open ? 0 : 1)};
      }

      &: nth-child(3) {
        transform: ${({ open }) => (open ? "rotate(-45deg)" : "rotate(0)")};
      }
    }
  }
`;

interface BurgerNavbarProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const BurgerNavbar = ({ open, setOpen }: BurgerNavbarProps) => {
  //   const [open, setOpen] = React.useState(false);
  return (
    <StyledBurger open={open} onClick={() => setOpen(!open)}>
      <div></div>
      <div></div>
      <div></div>
    </StyledBurger>
  );
};

export default BurgerNavbar;
