import React from "react";
import { appTheme } from "util/appTheme";

const Header = ({
  children,
  size,
  type,
  align,
  style,
  className,
}: {
  children: string;
  size?: string;
  type: string;
  align?: string;
  style?: React.CSSProperties;
  className?: string;
}) => {
  return (
    <div
      className={`header ${type}-text${appTheme} text-${
        align === undefined ? "left" : align
      } font-${size === undefined ? "1rem" : size} ${className ?? ""}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default Header;
