import React from "react";
import ChainId, { chainIdFromEnv } from "util/chainId";

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
  const aurora = chainIdFromEnv() === ChainId.AuroraMainnet ? "--aurora" : "";
  return (
    <div
      className={`header ${type}-text${aurora} text-${
        align === undefined ? "left" : align
      } font-${size === undefined ? "1rem" : size} ${className ?? ""}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default Header;
