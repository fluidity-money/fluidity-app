import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Navigation.module.scss";

const Navigation = () => {
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
    <div className={styles.container}>
      <h4>
        <Link to="/resources#articles">{"↓ Articles"}</Link>
      </h4>
      <h4>
        <Link to="/resources#fluniversity">{"↓ Fluniversity"}</Link>
      </h4>
      <h4>
        <Link to="/resources#whitepapers">{"↓ Whitepapers"}</Link>
      </h4>
      <h4>
        <Link to="/resources#docs">{"↓ Documentation"}</Link>
      </h4>
    </div>
  );
};

export default Navigation;
