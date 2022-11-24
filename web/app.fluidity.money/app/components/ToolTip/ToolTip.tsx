import { useEffect, useRef, useState } from "react";

import styles from "./styles.css";
import { Text } from "@fluidity-money/surfing";
import { motion, useAnimation } from "framer-motion";

export const links = () => [{ rel: "stylesheet", href: styles }];

const rightIn = {
  visible: {
    opacity: 1,
    transform: "translateX(0px)",
    transition: { duration: 0.2 },
  },
  hidden: { opacity: 0, transform: "translateX(180px)" },
};

export const ToolTip = (props: {
  close: VoidFunction;
  bgColor: string;
  children: React.ReactNode;
}) => {
  const delay = 5000;
  const [width, setNewWidth] = useState(0);

  const savedCallback = useRef(props.close);
  const control = useAnimation();

  useEffect(() => {
    control.start("visible");
    setTimeout(() => {
      control.set("hidden");
    }, delay);

    let width = 0;
    const id = setInterval(() => {
      if (width < 100) setNewWidth((width += 0.2));
    }, 10);

    setTimeout(() => {
      clearInterval(id);
    }, delay);
  }, []);

  useEffect(() => {
    savedCallback.current = props.close;
  }, [props.close]);

  useEffect(() => {
    if (delay === null) return;

    const id = setTimeout(() => savedCallback.current(), delay);

    return () => clearTimeout(id);
  }, [delay]);

  return (
    <>
      <motion.div
        className="tooltip"
        animate={control}
        initial="hidden"
        variants={rightIn}
      >
        <div
          className="tooltip_content"
          style={{
            background: `linear-gradient(0.20turn, ${props.bgColor}, #000, ${props.bgColor})`,
          }}
        >
          {props.children}
          <span onClick={props.close} className="tool_cancel_btn">
            <Text prominent size="lg">
              x
            </Text>
          </span>
        </div>
      </motion.div>
      <div
        className="toolkit_duration_bar"
        style={{
          width: `${width}%`,
        }}
      ></div>
    </>
  );
};
