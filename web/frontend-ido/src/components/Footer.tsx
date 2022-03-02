import Button from "./Button";
import {FluidityIcon} from "./Titlebar";

const FluidityContact = () => (
  <div className="flex column fluidity-contact">
    <FluidityIcon/> 
    <a
      href="mailto:info@fluidity.money"
      style={{
        color: "#BAC8E9",
        fontSize: "16px",
      }}>
      info@fluidity.money
    </a>
  </div>
)

const ButtonContainer = () => (
  <div className="footer-button-container">
    <Button text="Home"/> 
    <Button text="About"/>
    <Button text="Blog"/>
    <Button text="Whitepapers"/> 
  </div>
)

const Footer = () => (
  <div className="footer flex row">
    <FluidityContact />
    <div className="flex column" style={{alignItems: 'center'}}>
      <div className="icon-box">
        <a href="https://twitter.com/fluiditymoney"><i className="i-twitter"/></a>
        <a href="https://discord.gg/dBnkJkxedd"><i className="i-discord"/></a>
        <a href="https://linkedin.com/company/fluidity-money"><i className="i-linkedin"/></a>
        <a href="https://t.me/fluiditymoney"><i className="i-telegram"/></a>
      </div>
      <div className="copyright-text">
        <a className="copyright-text" href="mailto:info@fluidity.money">
          © 2021 Fluidity All Rights Reserved
        </a>
      </div>
    </div>
    <ButtonContainer/>
  </div>
)

export default Footer;
