import { useEffect, useRef } from "react";

import styles from "./styles.css";
import { Text } from "@fluidity-money/surfing";

export const links = () => [{ rel: "stylesheet", href: styles }];

export const ToolTip = (props: {
  close: VoidFunction;
  bgColor: string;
  children: React.ReactNode;
}) => {
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
      <div
        className="tooltip_content"
        style={{
          background: `linear-gradient(0.20turn, ${props.bgColor}, #000, ${props.bgColor})`,
        }}
      >
        {props.children}
        <span onClick={props.close}>
          <Text prominent size="xl">
            X
          </Text>
        </span>
      </div>
      <div></div>
    </div>
  );
};
