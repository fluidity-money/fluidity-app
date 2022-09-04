// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { LinkButton } from "components/Button";
import useViewport from "~/util/hooks/useViewport";
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
  console.log("======>", children.replace(/\s+/g, "").toLowerCase());

  const itemList = (
    <ul>
      {items.map((item) => (
        <li key={item.title}>
          <a
            href={`/${children
              .replace(/\s+/g, "")
              .toLowerCase()}#${item.title.toLowerCase()}`}
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
        </li>
      ))}
    </ul>
  );

  return (
    <div className={styles.container}>
      <a href={`/${children.replace(/\s+/g, "").toLowerCase()}`}>
        <h1>{children}</h1>
      </a>

      {itemList}
    </div>
  );
};

export default FooterItem;
