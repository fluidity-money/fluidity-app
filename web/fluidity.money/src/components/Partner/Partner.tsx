// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import styles from "./Partner.module.scss";

interface IPropsPartner {
  img: string;
  title: string;
  info: string;
  url: string;
}

const Partner = ({ img, title, info, url }: IPropsPartner) => {
  return (
    <a href={url} rel="noopener noreferrer" target="_blank">
      <div className={styles.container}>
        <img src={img} alt={title} />
        <div>
          <h2>{title}</h2>
          <img src="assets/images/Group.svg" alt="link" />
        </div>
        <p>{info}</p>
      </div>
    </a>
  );
};

export default Partner;
