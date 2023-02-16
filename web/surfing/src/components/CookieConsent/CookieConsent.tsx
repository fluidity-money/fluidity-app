import styles from "./CookieConsent.module.scss";

export type CookieConsentProps = {
  activated: boolean;
  url: string;
  callback: () => void;
};

const CookieConsent = ({ activated, url, callback }: CookieConsentProps) => {
  return (
    <>
      {!activated ? (
        <div className={styles.container}>
          <div className={styles.text}>
            <h4>Hi there! 👋</h4>
            Fluidity uses cookies to ensure that we give you the best experience
            on our website. These are mostly for analytics and security
            purposes.
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
        </div>
      ) : (
        <></>
      )}
    </>
  )
};

export default CookieConsent;
