import React from "react";
import { TextButton } from "../../components/Button";
import ManualCarousel from "../../components/ManualCarousel";
import styles from "./Docs.module.scss";

const Docs = () => {
  return (
    <div className={styles.container}>
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
