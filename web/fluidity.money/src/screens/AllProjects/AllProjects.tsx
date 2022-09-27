// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FilterCriteria } from "@fluidity-money/surfing";
import FluidProject from "../../components/FluidProject";
import styles from "./AllProjects.module.scss";
import { clearForAny, handleFilterButton } from "./util";

interface IOption {
  name: string;
  selected: boolean;
}

const Filter = () => {
  /* scrolls to location on pageload if it contains same ID or scrolls to the top
   for ResourcesNavModal to work*/

  const [catOptions, setCatOptions] = useState(filters[0]);
  const [chains, setChains] = useState(filters[1]);
  const [years, setYears] = useState(filters[2]);
  const [filterList, setFilterList] = useState<string[]>([
    "anyCat",
    "anyChain",
    "anyYear",
  ]);
  const [projects, setProjects] = useState(fluidProjects);

  useEffect(() => {
    // filter based on filter list whenever the list changes
    handleFilterProjects();
    updateAny(chains, setChains);
    updateAny(years, setYears);
    updateAny(catOptions, setCatOptions);
  }, [filterList, catOptions, chains, years]);

  // updates filter to be any when last option is deselected
  const updateAny = (
    options: IOption[],
    setOption: React.Dispatch<React.SetStateAction<IOption[]>>
  ) => {
    let leng = options.filter((x) => x.selected === true).length;
    if (leng === 0) {
      setOption((previousState) =>
        previousState.map((item) => {
          if (!item.name.includes("any")) {
            return item;
          }
          return { ...item, selected: true };
        })
      );
    }
  };

  // add and remove items from the list used to filter the data
  const handleFilterList = (option: IOption) => {
    //if option was not selected
    if (option.selected === false) {
      if (option.name.includes("any")) {
        clearForAny(option, setFilterList);
      }
      // add to filterList
      else {
        !filterList.includes(option.name) &&
          setFilterList(() => [...filterList, option.name]);
      }
    }
    // if option was selected
    if (option.selected === true) {
      // if any reset the filterList
      if (option.name.includes("any")) {
        clearForAny(option, setFilterList);
      }
      // remove from filterList
      else {
        setFilterList((initalState) =>
          initalState.filter((item) => item !== option.name)
        );
      }
    }
  };

  // filter the projects based on cat/chains/years options
  const handleFilterProjects = () => {
    let checker = (arr: string[], target: string[]) =>
      target.every((v) => arr.includes(v));
    filterList.forEach(() =>
      setProjects(() =>
        fluidProjects.filter((x) => {
          // combine options and compare against filterList
          let list = [...x.categories, ...x.chains, ...x.years];
          return checker(list, filterList);
        })
      )
    );
  };

  // consolidated filter function
  const handleFilter = (
    option: IOption,
    setOption: React.Dispatch<React.SetStateAction<IOption[]>>
  ) => {
    handleFilterButton(option, setOption);
    handleFilterList(option);
  };

  // sort projects displayed
  const sortProjects = () => {
    setProjects([...projects].sort((a, b) => b.topPrize - a.topPrize));
  };

  return (
    <div className={styles.container} id="allprojects">
      <h1>Fluid projects</h1>
      <div className={styles.main}>
        <div className={styles.left}>
          <div className={styles.top}>Filter</div>
          <FilterCriteria
            options={catOptions}
            setOptions={setCatOptions}
            handleFilter={handleFilter}
          >
            CATEGORIES
          </FilterCriteria>
          <FilterCriteria
            options={chains}
            setOptions={setChains}
            handleFilter={handleFilter}
          >
            CHAIN
          </FilterCriteria>
          <FilterCriteria
            options={years}
            setOptions={setYears}
            handleFilter={handleFilter}
          >
            YEAR
          </FilterCriteria>
        </div>
        <div className={styles.right}>
          <div className={styles.top}>
            <div>{`${projects.length ? "1" : 0} - ${projects.length} of ${
              fluidProjects.length
            } Projects`}</div>
            <div onClick={() => sortProjects()}>Sort by Top Prize $$$ v</div>
          </div>
          <div className={styles.grid}>
            {projects.map((project) => (
              <FluidProject project={project} />
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
    { name: "anyCat", selected: true },
    { name: "defi", selected: false },
    { name: "dex", selected: false },
    { name: "nft", selected: false },
    { name: "gaming", selected: false },
    { name: "payments", selected: false },
    { name: "metaverse", selected: false },
    { name: "dao", selected: false },
  ],
  [
    { name: "anyChain", selected: true },
    { name: "solana", selected: false },
    { name: "polygon", selected: false },
    { name: "ethereum", selected: false },
  ],
  [
    { name: "anyYear", selected: true },
    { name: "2020", selected: false },
    { name: "2021", selected: false },
    { name: "2022", selected: false },
  ],
];

const fluidProjects = [
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
    categories: ["anyCat", "defi", "dex", "nft", "metaverse", "dao"],
    chains: ["anyChain", "ethereum"],
    years: ["anyYear", "2022"],
    topPrize: 5000,
  },
  {
    title: "🦍",
    categories: ["anyCat", "defi", "dex", "nft", "gaming", "payments"],
    chains: ["anyChain", "solana"],
    years: ["anyYear", "2022"],
    topPrize: 22000,
  },
  {
    title: "🦍",
    categories: ["anyCat", "nft", "gaming", "payments", "metaverse", "dao"],
    chains: ["anyChain", "polygon"],
    years: ["anyYear", "2022"],
    topPrize: 18000,
  },
  {
    title: "🦍",
    categories: [
      "anyCat",
      "defi",
      "dex",
      "gaming",
      "payments",
      "metaverse",
      "dao",
    ],
    chains: ["anyChain", "ethereum"],
    years: ["anyYear", "2022"],
    topPrize: 3000,
  },
  {
    title: "🦍",
    categories: ["anyCat", "dao"],
    chains: ["anyChain", "ethereum"],
    years: ["anyYear", "2022"],
    topPrize: 100,
  },
  {
    title: "🦍",
    categories: ["anyCat", "defi", "dex", "nft"],
    chains: ["anyChain", "solana"],
    years: ["anyYear", "2022"],
    topPrize: 700,
  },
  {
    title: "🦍",
    categories: ["anyCat", "dex", "nft", "gaming", "dao"],
    chains: ["anyChain", "solana"],
    years: ["anyYear", "2022"],
    topPrize: 7000,
  },
  {
    title: "🦍",
    categories: ["anyCat", "defi", "dex", "nft", "gaming", "metaverse", "dao"],
    chains: ["anyChain", "polygon"],
    years: ["anyYear", "2022"],
    topPrize: 8000,
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
    chains: ["anyChain", "polygon"],
    years: ["anyYear", "2022"],
    topPrize: 13000,
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
    chains: ["anyChain", "solana"],
    years: ["anyYear", "2022"],
    topPrize: 11000,
  },
  {
    title: "🦍",
    categories: ["anyCat", "defi", "metaverse", "dao"],
    chains: ["anyChain", "ethereum"],
    years: ["anyYear", "2022"],
    topPrize: 6000,
  },
  {
    title: "🦍",
    categories: ["anyCat", "defi", "dex", "nft", "gaming", "payments"],
    chains: ["anyChain", "ethereum"],
    years: ["anyYear", "2022"],
    topPrize: 1000,
  },
  {
    title: "🦍",
    categories: ["anyCat", "defi", "nft", "gaming", "metaverse"],
    chains: ["anyChain", "ethereum"],
    years: ["anyYear", "2022"],
    topPrize: 2000,
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
    chains: ["anyChain", "polygon"],
    years: ["anyYear", "2022"],
    topPrize: 19300,
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
    chains: ["anyChain", "solana"],
    years: ["anyYear", "2022"],
    topPrize: 18200,
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
    topPrize: 15000,
  },
  {
    title: "🦍",
    categories: ["anyCat", "defi", "gaming", "payments"],
    chains: ["anyChain", "ethereum"],
    years: ["anyYear", "2022"],
    topPrize: 4000,
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
    topPrize: 2000,
  },
  {
    title: "🦍",
    categories: ["anyCat", "defi", "dex", "nft", "gaming", "dao"],
    chains: ["anyChain", "solana"],
    years: ["anyYear", "2022"],
    topPrize: 9000,
  },
];
