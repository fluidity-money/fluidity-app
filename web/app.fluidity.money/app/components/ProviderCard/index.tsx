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
}

export type Provider = {
  iconUrl: string;
  name: string;
  prize: number;
  avgPrize: number;
};

const ProviderCard = ({ iconUrl, name, prize, avgPrize }: IProviderCard) => {
  return (
    <Card className="" style={{ display: "flex" }}>
      {/* Icon */}
      <img src={iconUrl} alt={`${name}-icon`} />

      {/* Provider Name */}
      <section style={{ display: "flex", flexDirection: "column" }}>
        <Heading as={"h5"}>Compound</Heading>
        <Text>{numberToMonetaryString(avgPrize)} Avg prize/trans</Text>
      </section>

      {/* Provider Prize */}
      <section style={{ display: "flex", flexDirection: "column" }}>
        <Text prominent={true}>{numberToMonetaryString(prize)}</Text>
        <Text>Top prize</Text>
      </section>
    </Card>
  );
};

export default ProviderCard;
