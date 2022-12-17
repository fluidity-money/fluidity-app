import styles from "./LoadingDots.module.scss";

type ILoadingDots = {
  size: "lg" | "md" | "sm";
};

const LoadingDots = ({size}: ILoadingDots) => (
  <div className={`${styles.loader} ${styles[size]}`} />
)

export default LoadingDots;
