const Icon = ({
  src,
  style,
  trigger,
}: {
  src: string;
  style?: React.CSSProperties;
  trigger?: () => void;
}) => {
  return (
    <i
      className={src}
      style={style ?? {}}
      onClick={trigger ?? (() => {})}
    />
  );
};

export default Icon;
