// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import SearchModal from "modals";
import React, { useState } from "react";
import ContinuousCarousel from "../../components/ContinuousCarousel";
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
          <input
            type="text"
            placeholder="🔍 Search projects and protocols"
            onClick={openModal}
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
