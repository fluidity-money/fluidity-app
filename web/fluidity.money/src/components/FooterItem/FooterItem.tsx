// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { LinkButton } from "components/Button";
import useViewport from "hooks/useViewport";
import Link from "next/link";
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
  const { width } = useViewport();
  const firstBreakpoint = 620;
  const secondBreakpoint = 560;

  const baseUrl = `/${children.replace(/\s+/g, "").toLowerCase()}`

  const itemList = (
    <ul>
      {items.map((item) => (
        <li key={item.title}>
          <Link
            href={`/${baseUrl}}#${item.title
              .replace(/\s+/g, "")
              .toLowerCase()}}`}
            passHref
          >
            <a
              href={`/${baseUrl}}#${item.title
                .replace(/\s+/g, "")
                .toLowerCase()}}`}
            >
              <LinkButton
                handleClick={() => {}}
                size={
                  width > firstBreakpoint
                    ? "large"
                    : width > secondBreakpoint && width < firstBreakpoint
                    ? "medium"
                    : "small"
                }
                type={item.type}
              >
                {item.title}
              </LinkButton>
            </a>
          </Link>
        </li>
      ))}
    </ul>
  );

  

  return (
    <div className={styles.container}>
      <Link 
        href={baseUrl} 
        passHref
      >
        <a href={baseUrl}>
          <h1>{children}</h1>
        </a>
      </Link>

      {itemList}
    </div>
  );
};

export default FooterItem;
