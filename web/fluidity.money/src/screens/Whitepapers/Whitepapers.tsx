// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ContinuousCarousel } from "@fluidity-money/surfing";
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
        <a href="https://whitepapers.fluidity.money/fluidity-economics-wp-v0.8.pdf">
          <div>
            <img src="https://www.gitbook.com/cdn-cgi/image/height=40,fit=contain,dpr=2,format=auto/https%3A%2F%2F3930547829-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252Fx4yhCpDhoCMNHh5hnFdg%252Flogo%252FdHNKzwEpKSmAvvwCKjPf%252FNEW%2520GRADIENT%2520WHITE%2520BACKGROUND%2520LOGO%2520FLUIDITY.png.png%3Falt%3Dmedia%26token%3D1d36671f-70f0-4059-8bfb-dfd1abbcac53" />
            <h3>Fluidity Money: Economics and Monetary Policy</h3>
            <p>24th June 2022 WHITEPAPER</p>
          </div>
        </a>
      </div>
    </>
  );
};

export default Whitepapers;
