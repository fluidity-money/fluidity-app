import { useEffect, useState } from "react";

import styles from "./CookieConsent.module.scss";

const CookieConsent = () => {
  const [cookieConsent, setCookieConsent] = useState(true); // Hide until polled locally
  useEffect(() => {
    if (!window) return;
    try {
      const _cookieConsent = localStorage.getItem("cookieConsent");
      if (!_cookieConsent) {
        setCookieConsent(false);
      }
    } catch (e) {
      console.warn(e);
    }
  }, []);

  return (
    !cookieConsent && (
      <div className={styles.container}>
        <div className={styles.text}>
          <h4>Hi there! 👋</h4>
          Fluidity uses cookies to ensure that we give you the best experience
          on our website. These are mostly for analytics and security purposes.
          <br />
          If you are curious about what we use cookies for, please read our{" "}
          <a
            href="https://static.fluidity.money/assets/fluidity-privacy-policy.pdf"
            className={styles.link}
          >
            Privacy Policy
          </a>
          .<br />
          We're open source, so our data usage is fully transparent.
        </div>
        <button
          className={styles.button}
          onClick={() => {
            try {
              localStorage.setItem("cookieConsent", "true");
              setCookieConsent(true);
            } catch (e) {
              console.warn(e);
            }
          }}
        >
          Got it!
        </button>
      </div>
    )
  );
};
export default CookieConsent;
