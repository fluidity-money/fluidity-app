import React from "react";
import styles from "./FooterItem.module.scss";

interface IItem {
  title: string;
  src: string;
  type: string;
}

interface IFooterItemProps {
  children: string;
  items: IItem[];
}

const FooterItem = ({ children, items }: IFooterItemProps) => {
  const itemList = (
    <ul>
      {items.map((item) => (
        <li>
          <a href={item.src}>{item.title}</a>
          {item.type === "arrow" ? <div>{">"}</div> : <div>{"[>]"}</div>}
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
