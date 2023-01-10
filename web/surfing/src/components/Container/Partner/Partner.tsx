// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import styles from "./Partner.module.scss";
import { ReactComponent as ExternalLinkIcon } from '~/assets/images/Group.svg';

interface IPropsPartner {
  img: string;
  title: string;
  info: string;
}

const Partner = ({ img, title, info }: IPropsPartner) => {
  return (
    <a href={url} rel="noopener noreferrer" target="_blank">
      <div className={styles.container}>
        <img src={img} alt={title} />
        <div>
          <h2>{title}</h2>
          <ExternalLinkIcon />
        </div>
        <p>{info}</p>
      </div>
    </a>
  );
};

export default Partner;
