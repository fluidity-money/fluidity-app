import { useEffect, useRef } from 'react';

import styles from "./styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

export const ToolTip = (props: any) => {
 
  const savedCallback = useRef(props.close);
  const delay = 5000;

  useEffect(() => {
    savedCallback.current = props.close;
  }, [props.close]);


  useEffect(() => {

    if (delay === null) return;

    const id = setTimeout(() => savedCallback.current(), delay);

    return () => clearTimeout(id);
  }, [delay]);

  
  return (
    <div className="tooltip">
      <div className="tooltip_content">{props.children}</div>
      <div>
        <button onClick={props.close} className="tooltip_close_btn">
          x
        </button>
      </div>
    </div>
  );
};