
import React from 'react';

type container = {
  children : JSX.Element | JSX.Element[]
};

const Container = ({ children } : container) =>
  <div style={styles.container}>
  </div>;

const styles : Record<string, React.CSSProperties> = {
  "container": {
    maxWidth: "1200px"
  }
};

export default Container;
