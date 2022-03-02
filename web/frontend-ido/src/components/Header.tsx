import {DetailedHTMLProps, HTMLAttributes} from "react";

interface HeaderProps extends DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> {

}

const Header = ({children, ...props}: HeaderProps) =>
  <h1 {...props} className={`header ` + props.className}>
    {children}
  </h1>

export const FluidityIDOHeader = ({...props}: HeaderProps) =>
  <Header
    {...props}
    className={`fluidity-ido white ` + props.className}>Fluidity
    <strong
      style={{fontFamily: 'Poppins, sans-serif'}}> IDO
    </strong>
  </Header>

export default Header;
