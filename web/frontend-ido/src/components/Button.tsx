const Button = ({text}: {text: string}) => {
  return (
    <button className="button">
      <span className="text">{text}</span>
    </button>
  )
}

export default Button;
