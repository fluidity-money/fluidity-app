import React from "react";

import styles from "./TitleSubtitle.module.sass";

import { Display } from "../Display";
import Text from "../Text";

import pickCss from "../util/pickCss";

interface TitleSubtitleProps {
  title : string;
  subtitle : string;

  subtitleSize ?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

  center ?: boolean;
};

export const TitleSubtitle = ({ title, subtitle, subtitleSize="lg", center } : TitleSubtitleProps) =>
  <div>
    <Display extraSmall center={ center }>{title}</Display>
    <Text size={subtitleSize} center={ center }>{subtitle}</Text>
  </div>;

export default TitleSubtitle;
