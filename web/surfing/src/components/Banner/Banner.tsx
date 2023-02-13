import styles from "./Banner.module.scss";

export type BannerProps = {
  activated: boolean;
  callBack: () => void;
  positionFixed: boolean;
  children: React.ReactNode;
};

const Banner = ({
  activated,
  positionFixed = false,
  callBack,
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
