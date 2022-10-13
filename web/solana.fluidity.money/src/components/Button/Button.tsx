// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import React from "react";
import { TokenInfo } from "util/hooks/useFluidTokens";

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  label: string;
  token?: TokenInfo;
  theme?: string;
  texttheme?: string;
  className?: string;
  selected?: boolean;
  subSelected?: boolean;
  timeSelected?: boolean;
  goto: () => void;
  auth?: boolean;
  priviledge?: number;
  padding?: string;
  fontSize?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  visible?: boolean;
}

const Button = ({
  label,
  token,
  theme,
  texttheme,
  className,
  selected,
  subSelected,
  timeSelected,
  goto,
  auth,
  priviledge,
  padding,
  fontSize,
  icon,
  disabled,
  visible,
  ...props
}: ButtonProps) => {
  if (auth || priviledge === 0 || priviledge === undefined) {
    return (
      <button
        className={`
        ${padding ?? "button-defaultPadding"}
        button
        ${fontSize ?? ""}
        ${theme}
        ${selected === true ? "selected" : ""}
        ${className}
        ${subSelected === true ? "subSelected" : ""}
        ${timeSelected === true ? "timeSelected" : ""}
        ${disabled ? "disabled" : ""}
        `}
        disabled={disabled ? disabled : false}
        onClick={goto}
        {...props}
      >
        {icon}
        {theme === "select-token-button" ? (
          <>
            <div className="token-list-item-info">
              <div className="token-list-item-names">
                <div className={`${texttheme ?? ""}`}>{token?.token.name}</div>
                <div className="label">
                  {token?.config.amount === "0.0"
                    ? `${label}`
                    : `${Number(token?.config.amount).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6,
                      })} ${label}`}
                </div>
              </div>
              <div className={`${texttheme ?? ""}`}>
                {token
                  ? `${Number(token.config.amount).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}`
                  : "0"}
              </div>
            </div>
          </>
        ) : (
          <div className={`${texttheme ?? ""}`}>{label}</div>
        )}
        {visible === true ? (
          <img src={"img/chevronDown.svg"} className="chevron" alt="" />
        ) : visible === false ? (
          <img src={"img/chevronUp.svg"} className="chevron" alt="" />
        ) : (
          <></>
        )}
      </button>
    );
  }
  return <></>;
};

export default Button;
