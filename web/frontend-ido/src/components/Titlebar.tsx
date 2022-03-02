import Button from "./Button";

export const FluidityIcon = () => 
  <a href="" className="fluidity-icon">
    <i className="icon fluidity-logo"/> 
    <span className="icon-text"> Fluidity. </span>
  </a>

const Titlebar = () => {
  return (
    <div className="fluidity-text title-container">
      <FluidityIcon/>
      <div className="title-button-container">
        <Button text="IDO"/> 
        <Button text="About"/>
        <Button text="Contact"/>
        <Button text="Blog"/> 
        <Button text="Whitepapers"/> 
      </div>
    </div>
  )
}

export default Titlebar;
