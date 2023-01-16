import styles from "./Banner.module.scss";

export type BannerProps = {
  activated: boolean;
  url: string;
  callBack: () => void;
  positionFixed: boolean;
  children: React.ReactNode;
};

const Banner = ({ activated, url, positionFixed, callBack, children }: BannerProps) => {
  const containerClass = `${styles.container} ${positionFixed && styles.positionFixed}`;

  return (
    <>
      {!activated ? (
        <div className={containerClass}>
          { children }
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Banner;
