import React, { useEffect, useRef, useState } from "react";
import styles from "./Landing.module.scss";

const Landing = () => {
  /* onClick and onScroll background overlayer has to increase until not visible,
    original text has to fade out,
    new text has to fade in,
    slide up,
    manual carousel then slides in from the right
    */

  const [fadeProp, setFadeProp] = useState("fadeIn");
  const myRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log("my ref", myRef.current);
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      console.log("entry", entry);
      console.log("bcr", entry.boundingClientRect);
      console.log("isr", entry.intersectionRect);
      console.log("rb", entry.rootBounds);
      if (entry.boundingClientRect.top < 356) {
        handleClick();
      }
    });

    observer.observe(myRef.current as Element);
  }, []);

  const handleClick = () => {
    if (fadeProp === "fadeIn") {
      setFadeProp("fadeOut");
    } else {
      setFadeProp("fadeIn");
    }
    // fadeProp === "fadeIn" && setFadeProp("fadeOut");
  };

  return (
    <div className={`${styles.container}`} onClick={() => handleClick()}>
      <h1
        ref={myRef}
        className={`${fadeProp === "fadeIn" ? styles.fadeIn : styles.fadeOut}`}
      >
        MONEY DESIGNED TO BE MOVED
      </h1>
      <h1
        className={`${
          fadeProp === "fadeIn" ? styles.fadeOut : `${styles.fadeInText}`
        }`}
      >
        Fluidity is the blockchain incentive layer, <br />
        rewarding people for using their crypto.
      </h1>
      <div
        className={`${
          fadeProp === "fadeIn" ? styles.fadeOutCarousel : ` ${styles.carousel}`
        }`}
      >
        I AM A CAROUSEL!
      </div>
    </div>
  );
};

export default Landing;
