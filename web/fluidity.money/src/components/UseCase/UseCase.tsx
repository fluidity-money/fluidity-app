// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { Heading, Text } from "@fluidity-money/surfing";
import { motion } from "framer-motion";
import useViewport from "hooks/useViewport";
import React from "react";
import styles from "./UseCase.module.scss";

interface UseCaseProps {
  useCase: {
    img: string;
    title: string;
    info: string;
  };
}

const UseCase = ({ useCase }: UseCaseProps) => {
  const { width } = useViewport();
  return (
      <div className={styles.container}>
        <img src={useCase.img} alt="text representation" />
        <div className={styles.text}>
          <Heading as="h3">{useCase.title}</Heading>
          <Text as="p" size={width < 500 ? "sm" : "lg"}>
            {useCase.info}
          </Text>
        </div>
      </div>
  );
};

export default UseCase;
