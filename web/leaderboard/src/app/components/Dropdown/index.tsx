import { Text } from "@fluidity-money/surfing";

import { SORTING_INDEX } from "../../config";

import styles from "./Dropdown.module.scss";

const sortedBy = [
  { title: "VOLUME", name: SORTING_INDEX.VOLUME },
  { title: "REWARDS", name: SORTING_INDEX.REWARDS },
  { title: "#TX", name: SORTING_INDEX.NUMBER },
];

export const DropdownOptions = ({
  setSortedByItem,
  setOpenDropdown,
  sortData,
}: {
  setSortedByItem: (value: SORTING_INDEX) => void;
  setOpenDropdown: (value: boolean) => void;
  sortData: (value: string) => void;
}) => {
  return (
    <div className={styles.dropdown_options}>
      <ul>
        {sortedBy.map((option) => (
          <li key={`${option.title}`}>
            <button
              className={styles.option}
              onClick={() => {
                setSortedByItem(option.name);
                setOpenDropdown(false);
                sortData(option.name);
              }}
            >
              <Text size="xl" prominent={true}>
                {option.title}
              </Text>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
