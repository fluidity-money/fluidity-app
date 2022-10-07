import type { Provider } from "~/components/ProviderCard";

import { Heading, Text } from "@fluidity-money/surfing";
import { ProviderCard } from "~/components";

const NoUserRewards = ({ rewarder }: { rewarder: Provider }) => (
  <div className="noUserRewards">
    <section>
      <Heading as="h2">Spend to earn</Heading>
      <Text size="md">
        Use, send and receive fluid assets <br />
        to generate yield.
      </Text>
    </section>
    <section>
      <Text size="md">Highest reward distribution this week</Text>

      <ProviderCard
        iconUrl={rewarder.iconUrl}
        name={rewarder.name}
        prize={rewarder.prize}
        avgPrize={rewarder.avgPrize}
      />
    </section>
  </div>
);

export default NoUserRewards;
