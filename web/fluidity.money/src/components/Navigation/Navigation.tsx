// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { AnchorButton } from "components/Button";
import Link from "next/link";
import styles from "./Navigation.module.scss";

interface INavigation {
  page: string;
  pageLocations: string[];
}

const Navigation = ({ pageLocations, page }: INavigation) => {
  /* scrolls to location on pageload if it contains same ID or scrolls to the top */

  return (
    <div className={styles.container}>
      {pageLocations.map((location) => (
        <h4>
          <Link
            href={`/${page}#${location.replace(/\s/g, "")}`}
            passHref
          >  
            <a href={`/${page}#${location.replace(/\s/g, "")}`}>
              {<AnchorButton>{location.toUpperCase()}</AnchorButton>}
            </a>
          </Link>
        </h4>
      ))}
    </div>
  );
};

export default Navigation;
