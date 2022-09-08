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

  const redirect = (url : string) => {
    window.location.href = url;
  };

  return (
    <div className={styles.container} onClick={() => redirect(url)}>
      <img src= {img} alt=""/>
      <div>
       <h2>{title}</h2><img src="assets/images/Group.svg"/>
      </div>  
      <p>{info}</p>
    </div>
  );
};

export default Partner;
