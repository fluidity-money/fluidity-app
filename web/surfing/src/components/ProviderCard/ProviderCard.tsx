import { Provider } from "~/types";
import { numberToMonetaryString } from "~/util";
import {
  Card,
  Text,
  Heading,
  ProviderIcon,
} from "../";

import styles from './ProviderCard.module.scss'

interface IProviderCard {
  name: Provider;
  prize: number;
  avgPrize: number;
  size: "md" | "lg";
}

const ProviderCard = ({ name, prize, avgPrize, size }: IProviderCard) => {
  const cardProps =
    size === "lg" ? styles.lg : styles.md;

  const classProps = `${cardProps} ${styles.ProviderCard}`

  return (
    <Card className={classProps}>
      <div className={styles.left}>
        {/* Icon */}
        <ProviderIcon provider={name} />

        {/* Provider Name */}
        <div className={styles.section}>
          <Heading className={styles.name} as={"h5"}>
            {name === "Fluidity" ? "Transacting ƒAssets" : name}
          </Heading>
          <Text>{numberToMonetaryString(avgPrize)} Avg prize/tx</Text>
        </div>
      </div>

      {/* Provider Prize */}
      <div className={styles.section}>
        <Text prominent={true}>{numberToMonetaryString(prize)}</Text>
        <Text>Top prize</Text>
      </div>
    </Card>
  );
};

export default ProviderCard;
