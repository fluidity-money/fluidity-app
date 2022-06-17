const FormSection = ({
  children,
  cname,
  defaultMargin,
  onClickHandler,
}: {
  children?: JSX.Element | JSX.Element[];
  cname?: string;
  defaultMargin?: boolean;
  onClickHandler?: () => void;
}) => {
  return (
    <div
      className={`${cname ?? ""} ${
        defaultMargin === false ? "" : "swap-field-margin"
      }`}
      onClick={onClickHandler}
    >
      {children}
    </div>
  );
};

export default FormSection;
