import { Text } from "@fluidity-money/surfing";

import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div>
        <Text as="p" size="xs">
          Fluidity Money 2023
        </Text>
      </div>
      <div className={styles.btns}>
        <Text size="xs">
          <a
            href="https://static.fluidity.money/assets/fluidity-website-tc.pdf"
            target="_blank"
          >
            Terms
          </a>
        </Text>
        <Text size="xs">
          <a
            href="https://static.fluidity.money/assets/fluidity-privacy-policy.pdf"
            target="_blank"
          >
            Privacy policy
          </a>
        </Text>
        <Text size="xs">© 2023 Fluidity Money. All Rights Reserved.</Text>
      </div>
    </div>
  );
};

export default Footer;
