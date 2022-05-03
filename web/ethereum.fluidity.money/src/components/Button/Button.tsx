import { TokenKind } from "components/types";
import React from "react";

interface ButtonProps {
  label: string;
  token?: TokenKind;
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
      >
        {icon}
        {theme === "select-token-button" ? (
          <>
            <div className="token-list-item-info">
              <div className="token-list-item-names">
                <div className={`${texttheme ?? ""}`}>{token?.name}</div>
                <div className="label">
                  {token?.amount === "0.0"
                    ? `${label}`
                    : `${token?.amount} ${label}`}
                </div>
              </div>
              <div className={`${texttheme ?? ""}`}>
                {token ? `$${Number(token?.amount).toFixed(2)}` : "0"}
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
