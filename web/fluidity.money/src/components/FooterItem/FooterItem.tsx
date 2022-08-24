// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { LinkButton } from "components/Button";
import React from "react";
import styles from "./FooterItem.module.scss";

interface IItem {
  title: string;
  src: string;
  type: "internal" | "external";
}

interface IFooterItemProps {
  children: string;
  items: IItem[];
}

const FooterItem = ({ children, items }: IFooterItemProps) => {
  const itemList = (
    <ul>
      {items.map((item) => (
        <li key={item.title}>
          <LinkButton handleClick={() => {}} size="large" type={item.type}>
            {item.title}
          </LinkButton>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={styles.container}>
      <h1>{children}</h1>
      {itemList}
    </div>
  );
};

export default FooterItem;
