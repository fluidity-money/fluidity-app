import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Whitepapers.module.scss";

const Whitepapers = () => {
  /* scrolls to location on pageload if it contains same ID or scrolls to the top
   for ResourcesNavModal to work*/
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      let elem = document.getElementById(location.hash.slice(1));
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [location]);
  return (
    <div className={styles.container} id="whitepapers">
      Whitepapers
    </div>
  );
};

export default Whitepapers;
