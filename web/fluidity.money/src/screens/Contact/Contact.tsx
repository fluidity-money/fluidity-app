import React from "react";
import { TextButton } from "../../components/Button";
import styles from "./Contact.module.scss";

const Contact = () => {
  return (
    <div className={styles.container}>
      <div>Contact</div>
      <TextButton colour="white">SUBSCRIBE</TextButton>
    </div>
  );
};

export default Contact;
