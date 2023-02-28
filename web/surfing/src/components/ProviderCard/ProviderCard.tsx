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
    size === "lg" ? styles["provider-card-large"] : styles["provider-card-medium"];

  return (
    <Card className={cardProps}>
      <section className={styles['card-left']}>
        {/* Icon */}
        <ProviderIcon provider={name} />

        {/* Provider Name */}
        <section className={styles['card-section']}>
          <Heading className={styles['card-token-name']} as={"h5"}>
            {name === "Fluidity" ? "Transacting ƒAssets" : name}
          </Heading>
          <Text>{numberToMonetaryString(avgPrize)} Avg prize/tx</Text>
        </section>
      </section>

      {/* Provider Prize */}
      <section className={styles['card-section']}>
        <Text prominent={true}>{numberToMonetaryString(prize)}</Text>
        <Text>Top prize</Text>
      </section>
    </Card>
  );
};

export default ProviderCard;
