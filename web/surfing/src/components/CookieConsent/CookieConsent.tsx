import styles from "./CookieConsent.module.scss";

import { Banner, BannerProps } from "../Banner";

export type CookieConsentProps = {
  url: string;
} & Omit<BannerProps, "children">;

const CookieConsent = (props: CookieConsentProps) => {
  const {
    url,
    callback,
  } = props;

  return (
    <Banner {...props}>
      <div className={styles.text}>
        <h4>Hi there! 👋</h4>
        Fluidity uses cookies to ensure that we give you the best experience on
        our website. These are mostly for analytics and security purposes.
        <br />
        If you are curious about what we use cookies for, please read our{" "}
        <a href={url} className={styles.link}>
          Privacy Policy
        </a>
        .<br />
        We're open source, so our data usage is fully transparent.
      </div>
      <button className={styles.button} onClick={callback}>
        Got it!
      </button>
    </Banner>
  );
};

export default CookieConsent;
