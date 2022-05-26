import React from "react";

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  label: string;
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
        <div className={`${texttheme ?? ""}`}>{label}</div>
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
