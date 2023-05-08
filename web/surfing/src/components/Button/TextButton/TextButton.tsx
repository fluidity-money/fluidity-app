import styles from './TextButton.module.scss';

interface ITextButton extends React.ButtonHTMLAttributes<HTMLButtonElement>{
  children: React.ReactNode;
}

export const TextButton: React.FC<ITextButton> = ({
  children,
  className,
  ...props
}) => {

  return (
    <button
      className={`${className} ${styles.TextButton}`}
      {...props}
    >
      {children}
    </button>
  );
};
