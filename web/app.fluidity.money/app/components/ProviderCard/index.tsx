import { Card, numberToMonetaryString, Text, Heading } from "@fluidity-money/surfing";

interface IProviderCard {
  iconUrl: string;
  name: string;
  prize: number;
  avgPrize: number;
}

const ProviderCard = ({iconUrl, name, prize, avgPrize}: IProviderCard) => {
  return (
    <Card
    >
      {/* Icon */}
      <img src={iconUrl} alt={`${name}-icon`} />

      {/* Provider Name */}
      <section>
        <Heading as={"h5"}>{numberToMonetaryString(prize)}</Heading>
        <Text>{numberToMonetaryString(avgPrize)} Avg prize/trans</Text>
      </section>

      {/* Provider Prize */}
      <section>
        <Text prominent={true}>{numberToMonetaryString(prize)}</Text>
        <Text>Top prize</Text>
      </section>
  
    </Card>
  )
}

export default ProviderCard;
