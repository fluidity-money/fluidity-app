import { Rarity } from "~/types/airdrop";
import styles from "./LootBottle.module.scss";
import Text from "~/components/Text/Text";

import { ReactComponent as BOTTLE_0_INACTIVE } from "~/assets/images/airdrop/0 INACTIVE.svg";
import { ReactComponent as BOTTLE_1_COMMON } from "~/assets/images/airdrop/1 COMMON.svg";
import { ReactComponent as BOTTLE_2_COMMON } from "~/assets/images/airdrop/2 COMMON.svg";
import { ReactComponent as BOTTLE_3_COMMON } from "~/assets/images/airdrop/3 COMMON.svg";
import { ReactComponent as BOTTLE_4_COMMON } from "~/assets/images/airdrop/4 COMMON.svg";
import { ReactComponent as BOTTLE_1_UNCOMMON } from "~/assets/images/airdrop/1 UNCOMMON.svg";
import { ReactComponent as BOTTLE_2_UNCOMMON } from "~/assets/images/airdrop/2 UNCOMMON.svg";
import { ReactComponent as BOTTLE_3_UNCOMMON } from "~/assets/images/airdrop/3 UNCOMMON.svg";
import { ReactComponent as BOTTLE_4_UNCOMMON } from "~/assets/images/airdrop/4 UNCOMMON.svg";
import { ReactComponent as BOTTLE_1_RARE } from "~/assets/images/airdrop/1 RARE.svg";
import { ReactComponent as BOTTLE_2_RARE } from "~/assets/images/airdrop/2 RARE.svg";
import { ReactComponent as BOTTLE_3_RARE } from "~/assets/images/airdrop/3 RARE.svg";
import { ReactComponent as BOTTLE_4_RARE } from "~/assets/images/airdrop/4 RARE.svg";
import { ReactComponent as BOTTLE_1_ULTRA_RARE } from "~/assets/images/airdrop/1 ULTRA RARE.svg";
import { ReactComponent as BOTTLE_2_ULTRA_RARE } from "~/assets/images/airdrop/2 ULTRA RARE.svg";
import { ReactComponent as BOTTLE_3_ULTRA_RARE } from "~/assets/images/airdrop/3 ULTRA RARE.svg";
import { ReactComponent as BOTTLE_4_ULTRA_RARE } from "~/assets/images/airdrop/4 ULTRA RARE.svg";
import { ReactComponent as BOTTLE_1_LEGENDARY } from "~/assets/images/airdrop/1 LEGENDARY.svg";
import { ReactComponent as BOTTLE_2_LEGENDARY } from "~/assets/images/airdrop/2 LEGENDARY.svg";
import { ReactComponent as BOTTLE_3_LEGENDARY } from "~/assets/images/airdrop/3 LEGENDARY.svg";
import { ReactComponent as BOTTLE_4_LEGENDARY } from "~/assets/images/airdrop/4 LEGENDARY.svg";
import { ReactComponent as BOTTLE_LEGENDARY } from "~/assets/images/airdrop/LEGENDARY.svg";
import { ReactComponent as BOTTLE_ULTRA_RARE } from "~/assets/images/airdrop/ULTRA RARE.svg";
import { ReactComponent as BOTTLE_RARE } from "~/assets/images/airdrop/RARE.svg";
import { ReactComponent as BOTTLE_UNCOMMON } from "~/assets/images/airdrop/UNCOMMON.svg";
import { ReactComponent as BOTTLE_COMMON } from "~/assets/images/airdrop/COMMON.svg";

interface ILootBottle {
  size: "sm" | "lg";
  rarity: Rarity;
  quantity?: number;
  className?: string;
  style?: React.CSSProperties;
}

const getTier = (rarity: Rarity, quantity: number) => {
  switch (rarity) {
    case Rarity.Common:
      if (quantity >= 1000) return 4;
      if (quantity >= 100) return 3;
      if (quantity >= 10) return 2;
      if (quantity >= 1) return 1;
      return 0;
    case Rarity.Uncommon:
      if (quantity >= 500) return 4;
      if (quantity >= 50) return 3;
      if (quantity >= 5) return 2;
      if (quantity >= 1) return 1;
      return 0;
    case Rarity.Rare:
      if (quantity >= 100) return 4;
      if (quantity >= 10) return 3;
      if (quantity >= 3) return 2;
      if (quantity >= 1) return 1;
      return 0;
    case Rarity.UltraRare:
      if (quantity >= 10) return 4;
      if (quantity >= 5) return 3;
      if (quantity >= 1) return 2;
      return 0;
    case Rarity.Legendary:
      if (quantity >= 1) return 4;
      return 0;
  }
};

const getBottleIcon = (rarity: Rarity, tier?: number) => {
  if (tier === undefined) {
    switch (rarity) {
      case Rarity.Common:
        return BOTTLE_COMMON;
      case Rarity.Uncommon:
        return BOTTLE_UNCOMMON;
      case Rarity.Rare:
        return BOTTLE_RARE;
      case Rarity.UltraRare:
        return BOTTLE_ULTRA_RARE;
      case Rarity.Legendary:
        return BOTTLE_LEGENDARY;
    }
  }
  if (tier === 0) return BOTTLE_0_INACTIVE;
  switch (rarity) {
    case Rarity.Common:
      switch (tier) {
        case 1:
          return BOTTLE_1_COMMON;
        case 2:
          return BOTTLE_2_COMMON;
        case 3:
          return BOTTLE_3_COMMON;
        case 4:
          return BOTTLE_4_COMMON;
      }
    case Rarity.Uncommon:
      switch (tier) {
        case 1:
          return BOTTLE_1_UNCOMMON;
        case 2:
          return BOTTLE_2_UNCOMMON;
        case 3:
          return BOTTLE_3_UNCOMMON;
        case 4:
          return BOTTLE_4_UNCOMMON;
      }
    case Rarity.Rare:
      switch (tier) {
        case 1:
          return BOTTLE_1_RARE;
        case 2:
          return BOTTLE_2_RARE;
        case 3:
          return BOTTLE_3_RARE;
        case 4:
          return BOTTLE_4_RARE;
      }
    case Rarity.UltraRare:
      switch (tier) {
        case 1:
          return BOTTLE_1_ULTRA_RARE;
        case 2:
          return BOTTLE_2_ULTRA_RARE;
        case 3:
          return BOTTLE_3_ULTRA_RARE;
        case 4:
          return BOTTLE_4_ULTRA_RARE;
      }
    case Rarity.Legendary:
      switch (tier) {
        case 1:
          return BOTTLE_1_LEGENDARY;
        case 2:
          return BOTTLE_2_LEGENDARY;
        case 3:
          return BOTTLE_3_LEGENDARY;
        case 4:
          return BOTTLE_4_LEGENDARY;
      }
  }
};

export const LootBottle = ({
  size = "sm",
  rarity = Rarity.Common,
  quantity,
  className = "",
  style = {},
}: ILootBottle) => {
  // despite my best efforts, this happens. failsafe here.
  if (!rarity) return <></>;

  const Component = getBottleIcon(
    rarity,
    quantity !== undefined ? getTier(rarity, quantity) : undefined
  ) as React.ElementType;

  const classNames = `
    ${styles.LootBottle}
    ${styles[size]}
    ${className}
  `;

  return (
    <div className={classNames} style={style}>
      <Component />
    </div>
  );
};
