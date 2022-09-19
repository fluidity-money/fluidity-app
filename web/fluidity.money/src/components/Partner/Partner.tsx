// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import React from "react";
import styles from "./Partner.module.scss";

interface IPropsPartner {
  img: string;
  title: string;
  info: string;
  url: string;
}

const Partner = ({ img, title, info, url }: IPropsPartner) => {
  return (

    <div className={styles.container}>
      <a href={url} rel="noopener noreferrer" target="_blank">
        <img src={img} alt="card" />
        <div>
          <h2>{title}</h2>
          <img src="assets/images/Group.svg" alt="link" />
        </div>
        <p>{info}</p>
      </a>

    </div>
  );
};

export default Partner;
