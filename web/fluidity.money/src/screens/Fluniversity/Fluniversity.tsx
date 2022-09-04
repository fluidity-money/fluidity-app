// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ContinuousCarousel, ManualCarousel } from "surfing";
import styles from "./Fluniversity.module.scss";

const Fluniversity = () => {
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
          <h2>FLUNIVERSITY</h2>
          <h2>FLUNIVERSITY</h2>
          <h2>FLUNIVERSITY</h2>
          <h2>FLUNIVERSITY</h2>
          <h2>FLUNIVERSITY</h2>
          <h2>FLUNIVERSITY</h2>
          <h2>FLUNIVERSITY</h2>
          <h2>FLUNIVERSITY</h2>
          <h2>FLUNIVERSITY</h2>
          <h2>FLUNIVERSITY</h2>
          <h2>FLUNIVERSITY</h2>
        </div>
      </ContinuousCarousel>
        <div className={styles.container} id="fluniversity">
          <ManualCarousel>
            {items.map((item) => (
              <div className={styles.fluniversityCard}>
                <img src={item.img}/>
                <h3>{item.title}</h3>
                <p>
                  {item.desc}
                </p>
                <span>{item.time} mins read</span>
                <span><a href={item.link}>FLUNIVERSITY <i>*</i></a></span>
              </div>
            ))}
          </ManualCarousel>
        </div>
     </>
  );
};

export default Fluniversity;

const items = [
  { 
    img: "https://picsum.photos/200/300/?blur",
    title: "Fluidity University Part 3: Utility Mining: A fairer token distribution strategy",
    desc: `In the first two parts of fluidity University, we've introduced the basics of how to distribute
    yield through spending and how the protocol protects itself against cheaters...`,
    time: "8",
    link: "",
  },
  { 
    img: "https://picsum.photos/200/300/?blur",
    title: "Fluidity University Part 3: Utility Mining: A fairer token distribution strategy",
    desc: `In the first two parts of fluidity University, we've introduced the basics of how to distribute
    yield through spending and how the protocol protects itself against cheaters...`,
    time: "8",
    link: "",
  },
  { 
    img: "https://picsum.photos/200/300/?blur",
    title: "Fluidity University Part 3: Utility Mining: A fairer token distribution strategy",
    desc: `In the first two parts of fluidity University, we've introduced the basics of how to distribute
    yield through spending and how the protocol protects itself against cheaters...`,
    time: "8",
    link: "",
  },
  { 
    img: "https://picsum.photos/200/300/?blur",
    title: "Fluidity University Part 3: Utility Mining: A fairer token distribution strategy",
    desc: `In the first two parts of fluidity University, we've introduced the basics of how to distribute
    yield through spending and how the protocol protects itself against cheaters...`,
    time: "8",
    link: "",
  },
  { 
    img: "https://picsum.photos/200/300/?blur",
    title: "Fluidity University Part 3: Utility Mining: A fairer token distribution strategy",
    desc: `In the first two parts of fluidity University, we've introduced the basics of how to distribute
    yield through spending and how the protocol protects itself against cheaters...`,
    time: "8",
    link: "",
  },
];
