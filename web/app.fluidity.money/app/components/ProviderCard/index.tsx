import {
  Card,
  numberToMonetaryString,
  Text,
  Heading,
} from "@fluidity-money/surfing";

interface IProviderCard {
  iconUrl: string;
  name: string;
  prize: number;
  avgPrize: number;
  size: "md" | "lg";
}

export type Provider = {
  iconUrl: string;
  name: string;
  prize: number;
  avgPrize: number;
};

const ProviderCard = ({
  iconUrl,
  name,
  prize,
  avgPrize,
  size,
}: IProviderCard) => {
  return (
    <Card
      className={size === "lg" ? "provider-card-large" : "provider-card-medium"}
    >
      <section className="card-left">
        {/* Icon */}
        <img src={iconUrl} alt={`${name}-icon`} />

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
