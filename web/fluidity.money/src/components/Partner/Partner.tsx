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
<<<<<<< HEAD
    <a href={url} rel="noopener noreferrer" target="_blank">
      <div className={styles.container}>
        <img src={img} alt={title} />
=======

    <div className={styles.container}>
      <a href={url} rel="noopener noreferrer" target="_blank">
        <img src={img} alt="card" />
>>>>>>> ddb3ddfaae972a66bc3e9669bd8ec8a5da8ffea8
        <div>
          <h2>{title}</h2>
          <img src="assets/images/Group.svg" alt="link" />
        </div>
        <p>{info}</p>
<<<<<<< HEAD
      </div>
    </a>
=======
      </a>

    </div>
>>>>>>> ddb3ddfaae972a66bc3e9669bd8ec8a5da8ffea8
  );
};

export default Partner;
