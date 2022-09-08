// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { Heading, Text } from "@fluidity-money/surfing";
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
  return (
    <div className={styles.container}>
      <img src={useCase.img} alt="text representation" />
      <div className={styles.text}>
        <Heading as="h3">{useCase.title}</Heading>
        <Text as="p">{useCase.info}</Text>
      </div>
    </div>
  );
};

export default UseCase;
