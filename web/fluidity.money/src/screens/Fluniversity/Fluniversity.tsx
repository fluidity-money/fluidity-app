import React from "react";
import ManualCarousel from "../../components/ManualCarousel";
import styles from "./Fluniversity.module.scss";

const Fluniversity = () => {
  return (
    <div className={styles.container}>
      <div>FLUNIVERSITY</div>
      <ManualCarousel>
        {items.map((item) => (
          <div
            style={{
              border: "1px solid white",
              height: 600,
              minWidth: 600,
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

export default Fluniversity;

const items = [
  { item: "🦍" },
  { item: "🦍" },
  { item: "🦍" },
  { item: "🦍" },
  { item: "🦍" },
  { item: "🦍" },
  { item: "🦍" },
];
