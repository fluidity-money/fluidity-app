// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import React from "react";
import styles from "./HowItWorksTemplate.module.scss";

interface ITemplateProps {
  children: string;
}

const HowItWorksTemplate = ({ children }: ITemplateProps) => {
  return (
    <div className={styles.grid}>
      <div className={styles.left}>
        <div className={styles.content}>
          <h1>{children}</h1>
          <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit
            nisi reprehenderit, corporis excepturi quos, porro assumenda
            exercitationem voluptatem quidem labore.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit
            nisi reprehenderit, corporis excepturi quos, porro assumenda
            exercitationem voluptatem quidem labore, neque consectetur illo
            atque! Aut atque sapiente maiores nisi dignissimos?
          </p>
        </div>
      </div>
      <div className={styles.right}>
        <div style={{ fontSize: 160 }}>🦍</div>
      </div>
    </div>
  );
};

export default HowItWorksTemplate;
