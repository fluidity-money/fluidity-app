// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import type { ButtonHTMLAttributes } from "react";

import { ReactComponent as ArrowDown } from "~/assets/images/buttonIcons/arrowDownWhite.svg";
import { Heading } from "~/components/Heading";
import styles from "./AttentionButton.module.scss";

interface IAttentionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {handleClick: () => void}

const AttentionButton = ({ children, handleClick, className, ...props }: IAttentionButtonProps) => {
  const classProp = className || "";

  return (
    <button className={`${styles.attention} ${classProp}`} onClick={handleClick} {...props} >
      <Heading as="h5">
            <b>{children}</b>
          </Heading>
    </button>
  );
};

export default AttentionButton;
