// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ContinuousCarousel } from "surfing";
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
    <>
      <ContinuousCarousel direction={"right"}>
        <div className={styles.carouselText}>
          <h2>WHITEPAPERS</h2>
          <h2>WHITEPAPERS</h2>
          <h2>WHITEPAPERS</h2>
          <h2>WHITEPAPERS</h2>
          <h2>WHITEPAPERS</h2>
          <h2>WHITEPAPERS</h2>
          <h2>WHITEPAPERS</h2>
          <h2>WHITEPAPERS</h2>
          <h2>WHITEPAPERS</h2>
          <h2>WHITEPAPERS</h2>
          <h2>WHITEPAPERS</h2>
        </div>
      </ContinuousCarousel>
      <div className={styles.container} id="whitepapers">
        <div>
          <img src="https://picsum.photos/200/300/?blur"/>
          <h3>Fluidity Money: Economics and Monetary Policy</h3>
          <p>24th June 2022 WHITEPAPER</p>
        </div>
      </div>
    </>
    
  );
};

export default Whitepapers;
