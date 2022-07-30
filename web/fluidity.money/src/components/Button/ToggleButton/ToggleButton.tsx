import React, { useState } from "react";
import styles from "./ToggleButton.module.scss";

interface IToggleProps {
  toggle: boolean;
  setToggle: () => void;
}

const ToggleButton = ({ toggle, setToggle }: IToggleProps) => {
  // const [toggle, setToggle] = useState(true);
  return (
    <div className={styles.container}>
      <div className={styles.toggleBar} onClick={setToggle}>
        <div className={styles.blockchain}>
          <div className={`${toggle ? styles.black : styles.white}`}>
            🦍 SOL
          </div>
          <div className={`${toggle ? styles.white : styles.black}`}>
            🦍 ETH
          </div>
        </div>
        <div
          className={`${
            toggle ? styles.toggleSliderLeft : styles.toggleSliderRight
          }`}
        ></div>
      </div>
    </div>
  );
};

export default ToggleButton;
