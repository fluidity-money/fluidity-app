// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useState } from "react";
import { ContinuousCarousel } from "surfing";
import { SearchModal } from "modals";
import styles from "./Search.module.scss";

const Search = () => {
  const [modal, setModal] = useState(false);
  const closeModal = () => {
    setModal(false);
  };

  const openModal = () => {
    setModal(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <h1>The Fluid Ecosystem</h1>
        <div className={styles.search}>
          <img
            className={styles.icon}
            src="/assets/images/magnifyingGlass.svg"
            alt="search icon"
          />
          <input
            type="text"
            placeholder="Search projects and protocols"
            onClick={openModal}
          ></input>
        </div>
      </div>

      <div className={styles.carousel}>
        <ContinuousCarousel direction="right">
          <div>
            {blockchains.map((blockchain, i) => (
              <div key={`blockchain-${i}`} className={styles.blockchain}>
                <h5>{blockchain}</h5>
              </div>
            ))}
          </div>
        </ContinuousCarousel>
      </div>
      {modal ? <SearchModal closeModal={closeModal} /> : <></>}
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
