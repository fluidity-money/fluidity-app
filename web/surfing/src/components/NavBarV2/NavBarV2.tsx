import { ReactElement, ReactNode } from "react";
import Text from "~/components/Text/Text";
import styles from "./NavBarV2.module.scss"; 

type NavBarV2Props = {
	vertical?: boolean
	children: NavbarItem[]
}

type NavbarItemProps = {
	children: ReactNode
	icon?: string
	active?: boolean
	to: string
}


const NavbarItem = ({ children, active }: NavbarItemProps): JSX.Element => {
	return <Text prominent={active} className={styles.navbarItem}>{children}</Text>
}

type NavbarItem = ReactElement<NavbarItemProps>

const NavBarV2 = ({
	vertical,
	children,
}: NavBarV2Props) => {
  const className = [
		styles.navbar,
		vertical && styles.vertical
	]
	.filter((className) => className)
	.join(" ");

  return (
    <div className={className}>
        {children}
    </div>
  )
}

export default NavBarV2

export { NavbarItem as Item }