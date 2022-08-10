import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { TextButton } from "../../components/Button";
import ManualCarousel from "../../components/ManualCarousel";
import styles from "./Docs.module.scss";

const Docs = () => {
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
    <div className={styles.container} id="documentation">
      <div>DOCUMENTATION</div>
      <TextButton colour="coloured">ALL DOCS</TextButton>
      <ManualCarousel>
        {items.map((item) => (
          <div
            style={{
              border: "1px solid white",
              height: 400,
              minWidth: 500,
              margin: 20,
              marginBottom: 50,
            }}
          >
            {item.item}
          </div>
        ))}
      </ManualCarousel>
    </div>
  );
};

export default Docs;

const items = [
  { item: "🦍" },
  { item: "🦍" },
  { item: "🦍" },
  { item: "🦍" },
  { item: "🦍" },
  { item: "🦍" },
  { item: "🦍" },
];
