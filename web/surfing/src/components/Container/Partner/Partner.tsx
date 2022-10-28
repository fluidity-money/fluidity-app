// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import styles from "./Partner.module.scss";

interface IPropsPartner {
  img: string;
  title: string;
  info: string;
}

const Partner = ({ img, title, info }: IPropsPartner) => {
  return (
    <div className={styles.container}>
      <div>{img}</div>
      <h3>{title}</h3>
      <p>{info}</p>
    </div>
  );
};

export default Partner;
