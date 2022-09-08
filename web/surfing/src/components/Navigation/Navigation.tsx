import { AnchorButton } from "~/components/Button";
import Text from "../Text";
import styles from "./Navigation.module.scss";

interface INavigation {
  page: string;
  pageLocations: string[];
  style: "clear" | "black";
}

const Navigation = ({ pageLocations, page, style }: INavigation) => {
  /* scrolls to location on pageload if it contains same ID or scrolls to the top */
  const styleClassProp = `${style === "black" ? styles.black : ""}`

  return (
    <div className={`${styles.container} ${styleClassProp}`}>
      {pageLocations.map((location, i) => (
        <Text key={`anchor-${i}`}>
          <a href={`/${page}#${location.replace(/\s/g, "")}`}>
            {<AnchorButton>{location.toUpperCase()}</AnchorButton>}
          </a>
        </Text>
      ))}
    </div>
  );
};

export default Navigation;
