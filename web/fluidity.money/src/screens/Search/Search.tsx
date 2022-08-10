import React from "react";
import ContinuousCarousel from "../../components/ContinuousCarousel";
import styles from "./Search.module.scss";

const Search = () => {
  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <h1>The Fluid Ecosystem</h1>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="🔍 Search projects and protocols"
          ></input>
        </div>
      </div>

      <div className={styles.carousel}>
        <ContinuousCarousel direction="right">
          <div>
            {blockchains.map((blockchain) => (
              <div className={styles.blockchain}>
                <h5>{blockchain}</h5>
              </div>
            ))}
          </div>
        </ContinuousCarousel>
      </div>
    </div>
  );
};

export default Search;

const blockchains = [
  "Solana",
  "Polygon",
  "Ethereum",
  "Compound",
  "Ape",
  "Solana",
  "Polygon",
  "Ethereum",
  "Compound",
  "Ape",
  "Solana",
  "Polygon",
  "Ethereum",
  "Compound",
  "Ape",
  "Solana",
  "Polygon",
  "Ethereum",
  "Compound",
  "Ape",
];
