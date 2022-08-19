import React from "react";
import { GeneralButton } from "../../components/Button";
import styles from "./Contact.module.scss";

const Contact = () => {
  return (
    <div className={styles.container}>
      <div>Contact</div>
      <GeneralButton
        version={"primary"}
        type={"text"}
        size={"small"}
        handleClick={function (): void {
          throw new Error("Function not implemented.");
        }}
      >
        SUBSCRIBE
      </GeneralButton>
    </div>
  );
};

export default Contact;
