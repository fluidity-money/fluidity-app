import styles from './TextField.module.scss'

export interface DefaultInput extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  placeholder?: string
}

export interface ControlledInput {
  value: string
  onChange: (s: string) => void
}

export type ITextField = DefaultInput & (ControlledInput)

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
