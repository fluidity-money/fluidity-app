import type { ComponentType, HTMLProps } from "react";

import styles from './Container.module.scss';

interface IContainer extends HTMLProps<HTMLDivElement> {
  component: ComponentType<any> | ((...args: any[]) => JSX.Element),
}

const Container = ({component: Component, className, children, ...props}: IContainer) => {
  const classProps = className || "";
  
  return (
    <Component className={`${styles.gray} ${classProps}`} {...props}>
      {children}
    </Component>
  )
}

export default Container;
