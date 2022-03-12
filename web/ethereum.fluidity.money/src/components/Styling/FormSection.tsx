interface FormSectionProps extends React.ComponentPropsWithoutRef<'div'> {
  children?: JSX.Element | JSX.Element[];
  cname?: string;
  defaultMargin?: boolean;
  onClickHandler?: () => void;
}
const FormSection = ({
  children,
  cname,
  defaultMargin,
  onClickHandler,
  ...props
}: FormSectionProps) => {

  return (
    <div
      className={`${cname ?? ""} ${defaultMargin === false ? "" : "my-1-t"}`}
      onClick={onClickHandler}
      {...props}
    >
      {children}
    </div>
  );
};

export default FormSection;
