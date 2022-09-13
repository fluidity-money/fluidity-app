// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import useViewport from "~/util/hooks/useViewport";
import { LinkButton, Heading } from "~/components";
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
  const heading = width < 405 ? "h5" : "h4";

  const baseUrl = children.replace(/\s+/g, "").toLowerCase();

  const linkUrls = items.map(item =>
    item.type === "internal"
      ? `/${baseUrl}#${item.title.toLowerCase()}`
      : item.src
  )

  //  h1 {
  //   font-size: 36px;
  //   @media (max-width: 560px) {
  //     font-size: 20px;
  //   }
  // }

  const itemList = (
    <ul>
      {items.map((item, i) => (
        <li key={item.title}>
          <a
            href={linkUrls[i]}
          >
            <LinkButton
              handleClick={() => {}}
              size={
                width > firstBreakpoint
                  ? "small"
                  : width > secondBreakpoint && width < firstBreakpoint
                  ? "small"
                  : "small"
              }
              color={"gray"}
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
      <a href={`/${baseUrl}`}>
        <Heading as={heading}>{children}</Heading>
      </a>

      {itemList}
    </div>
  );
};

export default FooterItem;
