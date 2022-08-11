import React, { useState } from "react";
import FIlterCriteria from "../../components/FilterCriteria";
import FluidProject from "../../components/FluidProject";
import styles from "./Filter.module.scss";

const Filter = () => {
  const [catOptions, setCatOptions] = useState(filters[0]);
  const [chains, setChains] = useState(filters[1]);
  const [years, setYears] = useState(filters[2]);
  const [projects, setProjects] = useState(fluidProjects);

  interface IOption {
    name: string;
    selected: boolean;
  }

  // updates button option from selected to not selected
  const handleFilterOption = (
    option: IOption,
    setOption: React.Dispatch<React.SetStateAction<IOption[]>>
  ) => {
    // if option is any and it isn't selected, make any selected and clear options
    if (option.name === "any" && option.selected === false) {
      setOption((previousState) =>
        previousState.map((item) => {
          if (item.name === "any") {
            return item;
          }
          return { ...item, selected: false };
        })
      );
    }

    // if option isn't any, and isn't selected, unselect any
    if (option.name !== "any" && option.selected === false) {
      setOption((previousState) =>
        previousState.map((item) => {
          if (item.name !== "any") {
            return item;
          }
          return { ...item, selected: false };
        })
      );
    }

    // if invert option
    setOption((previousState) =>
      previousState.map((item) => {
        if (item.name !== option.name) {
          return item;
        }
        // if (item.name === "any") return { ...item, selected: false };
        return { ...item, selected: !option.selected };
      })
    );
  };

  // filter the projects based on cat/chains/years options
  const handleFilterProjects = () => {
    // if any === selected show all
    //filter cat
    //filter chains
    //filter years
  };

  const handleFilter = (
    option: IOption,
    setOption: React.Dispatch<React.SetStateAction<IOption[]>>
  ) => {
    handleFilterOption(option, setOption);
  };

  return (
    <div className={styles.container}>
      <h1>Fluid projects</h1>
      <div className={styles.main}>
        <div className={styles.left}>
          <div className={styles.top}>Filter</div>
          <FIlterCriteria
            options={catOptions}
            setOptions={setCatOptions}
            handleFilter={handleFilter}
          >
            CATEGORIES
          </FIlterCriteria>
          <FIlterCriteria
            options={chains}
            setOptions={setChains}
            handleFilter={handleFilter}
          >
            CHAIN
          </FIlterCriteria>
          <FIlterCriteria
            options={years}
            setOptions={setYears}
            handleFilter={handleFilter}
          >
            YEAR
          </FIlterCriteria>
        </div>
        <div className={styles.right}>
          <div className={styles.top}>
            <div>1 - 21 of 21 Projects</div>
            <div>Sort by Top Prize $$$ v</div>
          </div>
          <div className={styles.grid}>
            {projects.map((project) => (
              <FluidProject title={project.title} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;

interface IOption {
  name: string;
  selected: boolean;
}

const filters: IOption[][] = [
  [
    { name: "any", selected: true },
    { name: "defi", selected: false },
    { name: "dex", selected: false },
    { name: "nft", selected: false },
    { name: "gaming", selected: false },
    { name: "payments", selected: false },
    { name: "metaverse", selected: false },
    { name: "dao", selected: false },
  ],
  [
    { name: "any", selected: true },
    { name: "solana", selected: false },
    { name: "polygon", selected: false },
    { name: "ethereum", selected: false },
  ],
  [
    { name: "any", selected: true },
    { name: "2020", selected: false },
    { name: "2021", selected: false },
    { name: "2022", selected: false },
  ],
];

const fluidProjects = [
  {
    title: "🦍",
    categories: [
      "defi",
      "dex",
      "nft",
      "gaming",
      "payments",
      "metaverse",
      "dao",
    ],
    chain: "ethereum",
    year: "2022",
  },
  {
    title: "🦍",
    categories: [
      "defi",
      "dex",
      "nft",
      "gaming",
      "payments",
      "metaverse",
      "dao",
    ],
    chain: "ethereum",
    year: "2022",
  },
  {
    title: "🦍",
    categories: ["defi", "dex", "nft", "metaverse", "dao"],
    chain: "ethereum",
    year: "2022",
  },
  {
    title: "🦍",
    categories: ["defi", "dex", "nft", "gaming", "payments"],
    chain: "solana",
    year: "2022",
  },
  {
    title: "🦍",
    categories: ["nft", "gaming", "payments", "metaverse", "dao"],
    chain: "polygon",
    year: "2022",
  },
  {
    title: "🦍",
    categories: ["defi", "dex", "gaming", "payments", "metaverse", "dao"],
    chain: "ethereum",
    year: "2022",
  },
  {
    title: "🦍",
    categories: ["dao"],
    chain: "ethereum",
    year: "2022",
  },
  {
    title: "🦍",
    categories: ["defi", "dex", "nft"],
    chain: "solana",
    year: "2022",
  },
  {
    title: "🦍",
    categories: ["dex", "nft", "gaming", "dao"],
    chain: "solana",
    year: "2022",
  },
  {
    title: "🦍",
    categories: ["defi", "dex", "nft", "gaming", "metaverse", "dao"],
    chain: "polygon",
    year: "2022",
  },
  {
    title: "🦍",
    categories: [
      "defi",
      "dex",
      "nft",
      "gaming",
      "payments",
      "metaverse",
      "dao",
    ],
    chain: "polygon",
    year: "2022",
  },
  {
    title: "🦍",
    categories: [
      "defi",
      "dex",
      "nft",
      "gaming",
      "payments",
      "metaverse",
      "dao",
    ],
    chain: "solana",
    year: "2022",
  },
  {
    title: "🦍",
    categories: ["defi", "metaverse", "dao"],
    chain: "ethereum",
    year: "2022",
  },
  {
    title: "🦍",
    categories: ["defi", "dex", "nft", "gaming", "payments"],
    chain: "ethereum",
    year: "2022",
  },
  {
    title: "🦍",
    categories: ["defi", "nft", "gaming", "metaverse"],
    chain: "ethereum",
    year: "2022",
  },
  {
    title: "🦍",
    categories: [
      "defi",
      "dex",
      "nft",
      "gaming",
      "payments",
      "metaverse",
      "dao",
    ],
    chain: "polygon",
    year: "2022",
  },
  {
    title: "🦍",
    categories: [
      "defi",
      "dex",
      "nft",
      "gaming",
      "payments",
      "metaverse",
      "dao",
    ],
    chain: "solana",
    year: "2022",
  },
  {
    title: "🦍",
    categories: [
      "defi",
      "dex",
      "nft",
      "gaming",
      "payments",
      "metaverse",
      "dao",
    ],
    chain: "ethereum",
    year: "2022",
  },
  {
    title: "🦍",
    categories: ["defi", "gaming", "payments"],
    chain: "ethereum",
    year: "2022",
  },
  {
    title: "🦍",
    categories: [
      "defi",
      "dex",
      "nft",
      "gaming",
      "payments",
      "metaverse",
      "dao",
    ],
    chain: "ethereum",
    year: "2022",
  },
  {
    title: "🦍",
    categories: ["defi", "dex", "nft", "gaming", "dao"],
    chain: "solana",
    year: "2022",
  },
];
