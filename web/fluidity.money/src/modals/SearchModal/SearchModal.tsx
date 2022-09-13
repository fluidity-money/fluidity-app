// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useState } from "react";
import { GeneralButton } from "@fluidity-money/surfing";
import FluidProject from "components/FluidProject";
import ReactDOM from "react-dom";
import styles from "./SearchModal.module.scss";

interface ISearchModalProps {
  closeModal: () => void;
}

const SearchModal = ({ closeModal }: ISearchModalProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchProjects, setSearchProjects] = useState(projects);

  const resetLists = () => {
    setSearchProjects(projects);
  };

  // filtertext
  const handleFilter = (text: string) => {
    // if text is empty reset list
    if (text === "") resetLists();
    else {
      const searchString = text.toLowerCase();
      setSearchProjects(() =>
        [...projects].filter((project) => {
          return (
            project.categories.join(" ").includes(searchString) ||
            project.chains.join(" ").includes(searchString) ||
            project.years.join(" ").includes(searchString) ||
            project.title.toLocaleLowerCase().includes(searchString)
          );
        })
      );
    }
  };

  // sort projects displayed
  const sortProjects = () => {
    setSearchProjects(
      [...searchProjects].sort((a, b) => b.topPrize - a.topPrize)
    );
  };

  return ReactDOM.createPortal(
    <div className={styles.container}>
      <div className={styles.back} onClick={closeModal}>
        ← BACK
      </div>
      <div className={styles.search}>
        <img
          className={styles.icon}
          src="/assets/images/magnifyingGlass.svg"
          alt="search icon"
        />
        <input
          type="text"
          placeholder="Search"
          autoFocus
          onChange={(text: React.FormEvent<HTMLInputElement>) => {
            setSearchInput(text.currentTarget.value);
            handleFilter(text.currentTarget.value);
          }}
          value={searchInput}
        />
        <GeneralButton
          handleClick={() => {
            setSearchInput("");
            resetLists();
          }}
          version={"secondary"}
          buttonType={"text"}
          size={"large"}
        >
          CLEAR
        </GeneralButton>
      </div>
      <div className={styles.titles}>
        <h4>{`${searchProjects.length} Projects`}</h4>
        <div className={styles.sort}>
          <h4 onClick={() => sortProjects()}>Sort by</h4>
          <h4 className={styles.gray}>Top Prize $$$</h4>
          <img src="/assets/images/triangleDown.svg" alt="sort" />
        </div>
      </div>
      <div className={styles.grid}>
        {searchProjects.map((project) => (
          <FluidProject project={project} />
        ))}
      </div>
    </div>,
    document.getElementById("modal")!
  );
};

export default SearchModal;

const projects = [
  {
    title: "🦍",
    categories: [
      "anyCat",
      "defi",
      "dex",
      "nft",
      "gaming",
      "payments",
      "metaverse",
      "dao",
    ],
    chains: ["anyChain", "ethereum"],
    years: ["anyYear", "2022"],
    topPrize: 20000,
  },
  {
    title: "🦍",
    categories: [
      "anyCat",
      "defi",
      "dex",
      "nft",
      "gaming",
      "payments",
      "metaverse",
      "dao",
    ],
    chains: ["anyChain", "ethereum"],
    years: ["anyYear", "2022"],
    topPrize: 10000,
  },
  {
    title: "🦍",
    categories: ["anyCat", "defi", "dex", "payments", "metaverse", "dao"],
    chains: ["anyChain", "ethereum"],
    years: ["anyYear", "2022"],
    topPrize: 5000,
  },
  {
    title: "🦍",
    categories: ["anyCat", "gaming", "payments", "metaverse", "dao"],
    chains: ["anyChain", "ethereum"],
    years: ["anyYear", "2022"],
    topPrize: 2000,
  },
  {
    title: "🦍",
    categories: ["anyCat", "defi", "dex", "nft", "gaming", "dao"],
    chains: ["anyChain", "ethereum"],
    years: ["anyYear", "2022"],
    topPrize: 14000,
  },
  {
    title: "🦍",
    categories: [
      "anyCat",
      "defi",
      "dex",
      "nft",
      "payments",
      "metaverse",
      "dao",
    ],
    chains: ["anyChain", "ethereum"],
    years: ["anyYear", "2022"],
    topPrize: 12000,
  },
  {
    title: "🦍",
    categories: ["anyCat", "defi", "dex", "nft", "gaming", "payments"],
    chains: ["anyChain", "ethereum"],
    years: ["anyYear", "2022"],
    topPrize: 18000,
  },
  {
    title: "🦍",
    categories: ["anyCat", "dex", "nft", "payments", "dao"],
    chains: ["anyChain", "ethereum"],
    years: ["anyYear", "2022"],
    topPrize: 800,
  },
];
