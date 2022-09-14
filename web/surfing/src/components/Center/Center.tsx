import React from "react";

import styles from "./Center.module.scss";

interface CenterProps {
  children ?: React.ReactNode;
};

const Center = ({ children, ...props }: CenterProps) =>
  <div className={ styles.container }>
    <div className={ styles.final }>
      { children }
    </div>
  </div>;

export default Center;
