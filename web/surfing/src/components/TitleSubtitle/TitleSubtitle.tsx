import React from "react";

import styles from "./TitleSubtitle.module.scss";

import { Display } from "../Display";
import Text from "../Text";

import pickCss from "../util/pickCss";

interface TitleSubtitleProps {
  title : string | React.ReactNode;
  subtitle : string | React.ReactNode;

  subtitleSize ?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

  center ?: boolean;
};

export const TitleSubtitle = ({ title, subtitle, subtitleSize="lg", center } : TitleSubtitleProps) =>
  <div className={ styles.container }>
    <Display noMarginBottom extraSmall center={ center }>
      {title}
    </Display>

    <Text className={ styles.text } as="p" size={subtitleSize} center={ center }>
      {subtitle}
    </Text>
  </div>;

export default TitleSubtitle;
