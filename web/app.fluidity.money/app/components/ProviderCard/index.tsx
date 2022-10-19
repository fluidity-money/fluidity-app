import type { Providers } from "~/components/ProviderIcon";

import {
  Card,
  numberToMonetaryString,
  Text,
  Heading,
} from "@fluidity-money/surfing";
import { ProviderIcon } from "~/components";

interface IProviderCard {
  name: Providers;
  prize: number;
  avgPrize: number;
  size: "md" | "lg";
}

export type Provider = {
  name: Providers;
  prize: number;
  avgPrize: number;
};

const ProviderCard = ({
  name,
  prize,
  avgPrize,
  size,
}: IProviderCard) => {
  const cardProps =
    size === "lg" ? "provider-card-large" : "provider-card-medium";

  return (
    <Card className={cardProps}>
      <section className="card-left">
        {/* Icon */}
        <ProviderIcon provider={name} />

        {/* Provider Name */}
        <section className="card-section">
          <Heading className="card-token-name" as={"h5"}>
            {name}
          </Heading>
          <Text>{numberToMonetaryString(avgPrize)} Avg prize/trans</Text>
        </section>
      </section>

      {/* Provider Prize */}
      <section className="card-section">
        <Text prominent={true}>{numberToMonetaryString(prize)}</Text>
        <Text>Top prize</Text>
      </section>
    </Card>
  );
};

export default ProviderCard;
