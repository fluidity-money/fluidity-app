import styles from './Input.module.scss'

interface IInput extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

const Input: React.FC<IInput> = ({
  className = "",
  ...props
}) => {

  const presentationStyles = `
    ${styles.Input}
    ${className}
  `

  return <>
    <input>

    </input>
    <div className={presentationStyles}>
    </div>
  </>
}

export default Input
