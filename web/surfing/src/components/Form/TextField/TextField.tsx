import styles from './TextField.module.scss'

export interface ControlledInput extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: string
  onChange: (s: string) => void
  className?: string
  placeholder?: string
}


export type ITextField = ControlledInput

const TextField: React.FC<ITextField> = ({
  className = "",
  placeholder = "",
  value = "",
  onChange,
}) => {

  const presentationStyles = `
    ${styles.Input}
    ${className}
  `

  return <>
    <input
      type="text"
      className={presentationStyles}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </>
}

export default TextField
