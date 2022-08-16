import React, { useEffect, useState } from "react";
import FIlterCriteria from "../../components/FilterCriteria";
import FluidProject from "../../components/FluidProject";
import styles from "./Filter.module.scss";

const Filter = () => {
  const [catOptions, setCatOptions] = useState(filters[0]);
  const [chains, setChains] = useState(filters[1]);
  const [years, setYears] = useState(filters[2]);
  const [filterList, setFilterList] = useState<string[]>([
    "anyCat",
    "anyChain",
    "anyDate",
  ]);
  const [projects, setProjects] = useState(fluidProjects);

  interface IOption {
    name: string;
    selected: boolean;
  }

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

  useEffect(() => {
    console.log("FL", filterList);
    // filter based on filter list whenever the list changes
    handleFilterProjects();
    updateAny(chains, setChains);
    updateAny(years, setYears);
    updateAny(catOptions, setCatOptions);
  }, [filterList, catOptions, chains, years]);

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

  const handleFilterList = (
    option: IOption,
    setOption: React.Dispatch<React.SetStateAction<IOption[]>>
  ) => {
    //if option was not selected
    if (option.selected === false) {
      if (option.name.includes("any")) {
        if (option.name === "anyCat") {
          setFilterList((initalState) =>
            initalState.filter(
              (item) =>
                ![
                  "defi",
                  "dex",
                  "nft",
                  "gaming",
                  "payments",
                  "metaverse",
                  "dao",
                ].includes(item)
            )
          );
        }
        if (option.name === "anyChain") {
          setFilterList((initalState) =>
            initalState.filter(
              (item) => !["ethereum", "polygon", "solana"].includes(item)
            )
          );
        }
        if (option.name === "anyDate") {
          setFilterList((initalState) =>
            initalState.filter(
              (item) => !["2020", "2021", "2022"].includes(item)
            )
          );
        }
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
        if (option.name === "anyCat") {
          setFilterList((initalState) =>
            initalState.filter(
              (item) =>
                ![
                  "defi",
                  "dex",
                  "nft",
                  "gaming",
                  "payments",
                  "metaverse",
                  "dao",
                ].includes(item)
            )
          );
        }
        if (option.name === "anyChain") {
          setFilterList((initalState) =>
            initalState.filter(
              (item) => !["ethereum", "polygon", "solana"].includes(item)
            )
          );
        }
        if (option.name === "anyDate") {
          setFilterList((initalState) =>
            initalState.filter(
              (item) => !["2020", "2021", "2022"].includes(item)
            )
          );
        }
      }
      // remove from filterList
      else {
        setFilterList((initalState) =>
          initalState.filter((item) => item !== option.name)
        );
      }
    }
  };

  // updates button option from selected to not selected
  const handleFilterOption = (
    option: IOption,
    setOption: React.Dispatch<React.SetStateAction<IOption[]>>,
    options: IOption[]
  ) => {
    // if option is any and it isn't selected, make any selected and clear options
    if (option.name.includes("any") && option.selected === false) {
      setOption((previousState) =>
        previousState.map((item) => {
          if (item.name.includes("any")) {
            return item;
          }
          return { ...item, selected: false };
        })
      );
    }

    // if option isn't any, and isn't selected, unselect any
    if (!option.name.includes("any") && option.selected === false) {
      setOption((previousState) =>
        previousState.map((item) => {
          if (!item.name.includes("any")) {
            return item;
          }
          return { ...item, selected: false };
        })
      );
    }
    // invert option
    setOption((previousState) =>
      previousState.map((item) => {
        // if it isn't the same or if it is any and selected, no change
        if (
          item.name !== option.name ||
          (item.name.includes("any") && item.selected === true)
        ) {
          return item;
        }
        // invert button type
        return { ...item, selected: !option.selected };
      })
    );
  };

  const handleFilter = (
    option: IOption,
    setOption: React.Dispatch<React.SetStateAction<IOption[]>>,
    options: IOption[]
  ) => {
    handleFilterOption(option, setOption, options);
    handleFilterList(option, setOption);
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
            <div>{`${projects.length ? "1" : 0} - ${projects.length} of ${
              fluidProjects.length
            } Projects`}</div>
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
    { name: "anyDate", selected: true },
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
    years: ["anyDate", "2022"],
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
    years: ["anyDate", "2022"],
  },
  {
    title: "🦍",
    categories: ["anyCat", "defi", "dex", "nft", "metaverse", "dao"],
    chains: ["anyChain", "ethereum"],
    years: ["anyDate", "2022"],
  },
  {
    title: "🦍",
    categories: ["anyCat", "defi", "dex", "nft", "gaming", "payments"],
    chains: ["anyChain", "solana"],
    years: ["anyDate", "2022"],
  },
  {
    title: "🦍",
    categories: ["anyCat", "nft", "gaming", "payments", "metaverse", "dao"],
    chains: ["anyChain", "polygon"],
    years: ["anyDate", "2022"],
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
    years: ["anyDate", "2022"],
  },
  {
    title: "🦍",
    categories: ["anyCat", "dao"],
    chains: ["anyChain", "ethereum"],
    years: ["anyDate", "2022"],
  },
  {
    title: "🦍",
    categories: ["anyCat", "defi", "dex", "nft"],
    chains: ["anyChain", "solana"],
    years: ["anyDate", "2022"],
  },
  {
    title: "🦍",
    categories: ["anyCat", "dex", "nft", "gaming", "dao"],
    chains: ["anyChain", "solana"],
    years: ["anyDate", "2022"],
  },
  {
    title: "🦍",
    categories: ["anyCat", "defi", "dex", "nft", "gaming", "metaverse", "dao"],
    chains: ["anyChain", "polygon"],
    years: ["anyDate", "2022"],
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
    years: ["anyDate", "2022"],
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
    years: ["anyDate", "2022"],
  },
  {
    title: "🦍",
    categories: ["anyCat", "defi", "metaverse", "dao"],
    chains: ["anyChain", "ethereum"],
    years: ["anyDate", "2022"],
  },
  {
    title: "🦍",
    categories: ["anyCat", "defi", "dex", "nft", "gaming", "payments"],
    chains: ["anyChain", "ethereum"],
    years: ["anyDate", "2022"],
  },
  {
    title: "🦍",
    categories: ["anyCat", "defi", "nft", "gaming", "metaverse"],
    chains: ["anyChain", "ethereum"],
    years: ["anyDate", "2022"],
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
    years: ["anyDate", "2022"],
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
    years: ["anyDate", "2022"],
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
    years: ["anyDate", "2022"],
  },
  {
    title: "🦍",
    categories: ["anyCat", "defi", "gaming", "payments"],
    chains: ["anyChain", "ethereum"],
    years: ["anyDate", "2022"],
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
    years: ["anyDate", "2022"],
  },
  {
    title: "🦍",
    categories: ["anyCat", "defi", "dex", "nft", "gaming", "dao"],
    chains: ["anyChain", "solana"],
    years: ["anyDate", "2022"],
  },
];
