import styles from "./Banner.module.scss";

export type BannerProps = {
  activated: boolean;
  callback?: () => void;
  positionFixed?: boolean;
  children: React.ReactNode;
};

/**
 * Banner for showing messages to the user on the top of the page.
 * @todo: Add callback behaviour to the plain banner, close button, etc.
 * @param props BannerProps 
 */
const Banner = ({
  activated,
  positionFixed = false,
  children,
}: BannerProps) => {
  const containerClass = `${styles.container} ${
    positionFixed && styles.positionFixed
  }`;

  return (
    <>{!activated ? <div className={containerClass}>{children}</div> : <></>}</>
  );
};

export default Banner;
