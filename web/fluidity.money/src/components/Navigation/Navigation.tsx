// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { AnchorButton } from "components/Button";
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Navigation.module.scss";

interface INavigation {
  page: string;
  pageLocations: string[];
}

const Navigation = ({ pageLocations, page }: INavigation) => {
  /* scrolls to location on pageload if it contains same ID or scrolls to the top */
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
      {pageLocations.map((location) => (
        <h4>
          <Link to={`/${page}#${location.replace(/\s/g, "")}`}>
            {<AnchorButton>{location.toUpperCase()}</AnchorButton>}
          </Link>
        </h4>
      ))}
    </div>
  );
};

export default Navigation;
