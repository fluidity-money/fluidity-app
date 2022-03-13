const FormSection = ({
  children,
  cname,
  defaultMargin,
  onClickHandler
}: {
  children?: JSX.Element | JSX.Element[];
  cname?: string;
  defaultMargin?: boolean;
  onClickHandler?: () => void
}) => {

  return (
    <div
      className={`${cname ?? ""} ${defaultMargin === false ? "" : "my-1-t"}`}
      onClick={onClickHandler}
    >
      {children}
    </div>
  );
};

export default FormSection;
