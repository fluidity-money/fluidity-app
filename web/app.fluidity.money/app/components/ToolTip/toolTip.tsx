import { useEffect, useRef } from 'react';

import styles from "./styles.css";
import { Text } from "@fluidity-money/surfing";

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
      <div className="tooltip_content"
      style={{
        background: `linear-gradient(0.25turn, #ff0000, #000, #ff0000)`
      }}
      >
        <img className='tool_icon' src="https://s2.coinmarketcap.com/static/img/coins/64x64/1.png"/>
        <div>
          <Text prominent size="xl" className="asset_type_text_color"
          >100 fUSDC </Text>
          <Text size="lg">{props.children}</Text>
          <a className="tool_content_link">
            <Text prominent size="lg">ASSETS</Text>
          </a>
          <span onClick={props.close} className="tool_cancel_btn"><Text prominent size="xxl">x</Text></span>  
        </div>
      </div>
      <div>
      </div>
    </div>
  );
};