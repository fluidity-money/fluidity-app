import type { ComponentType, HTMLProps } from "react";

import styles from './Container.module.scss';

interface IContainer extends HTMLProps<HTMLDivElement> {
  component: ComponentType<any> | ((...args: any[]) => JSX.Element),
  rounded?: boolean,
  type?: "gray" | "box",
}

const Container = ({component: Component, rounded, className, children, type, ...props}: IContainer) => {
  const classProps = className || "";
  
  return (
    <Component className={`${type === "box" ? styles.box : styles.gray} ${rounded && styles.rounded} ${classProps}`} {...props}>
      {children}
    </Component>
  )
}

export default Container;
