import React from "react";

import styles from "./ScreenGetThatMoney.module.scss";

import TitleSubtitle from "../TitleSubtitle";

import pickCss from "../util/pickCss";

interface ScreenGetThatMoneyProps {
  children ?: React.ReactNode;
};

export const ScreenGetThatMoney = ({ children, ...props }: ScreenGetThatMoneyProps) =>
  <div class={ styles.container }>
    <TitleSubtitle
      title="Get. That. Money."
      subtitle="$23,536 USD in unclaimed prizes."
      center />
  </div>;

export default ScreenGetThatMoney;
