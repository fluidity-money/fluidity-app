import React from "react";
import ManualCarousel from "../../components/ManualCarousel";
import styles from "./UseCases.module.scss";

const UseCases = () => {
  /*
  manual carousel of boxes containing image and text
  */
  return (
    <div
      style={{ display: "flex", flexDirection: "column" }}
      className={styles.container}
    >
      <div>UseCases</div>
      <ManualCarousel>
        {items.map((item) => (
          <div
            style={{
              border: "1px solid white",
              height: 400,
              minWidth: 350,
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

export default UseCases;

const items = [
  { item: "🦍" },
  { item: "🦍" },
  { item: "🦍" },
  { item: "🦍" },
  { item: "🦍" },
  { item: "🦍" },
  { item: "🦍" },
];
