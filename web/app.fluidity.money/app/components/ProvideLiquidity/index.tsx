import { Card, Heading, Text } from "@fluidity-money/surfing";
import { motion } from "framer-motion";

const providers = [
  {
    name: "Orca",
    img: "/images/providers/Orca.svg",
    link: "https://www.orca.so/",
  },
  {
    name: "Orca2",
    img: "/images/providers/Orca.svg",
    link: "https://www.orca.so/",
  },
  {
    name: "Orca3",
    img: "/images/providers/Orca.svg",
    link: "https://www.orca.so/",
  },
  {
    name: "Orca4",
    img: "/images/providers/Orca.svg",
    link: "https://www.orca.so/",
  },
  {
    name: "Orca5",
    img: "/images/providers/Orca.svg",
    link: "https://www.orca.so/",
  },
  {
    name: "Orca6",
    img: "/images/providers/Orca.svg",
    link: "https://www.orca.so/",
  },
];

const parent = {
  variantA: { scale: 1 },
  variantB: { scale: 1 },
};

const child = {
  variantA: { scale: 1 },
  variantB: { scale: 1.05 },
};

const ProvideLiquidity = () => {
  const liqidityProviders = (
    <div className="liquidity-providers">
      {providers.map((provider) => (
        <motion.a
          key={provider.name}
          href={provider.link}
          rel="noopener noreferrer"
          target="_blank"
          variants={parent}
          initial="variantA"
          whileHover="variantB"
        >
          <motion.img src={provider.img} variants={child} />
        </motion.a>
      ))}
    </div>
  );

  return (
    <Card
      id="provide-liquidity"
      className="card-outer"
      component="div"
      rounded={true}
      type={"box"}
    >
      <div className="card-inner">
        <section className="provide-liquidity-left">
          <div>
            <Heading as="h2" className="provide-heading">
              Provide Liquidity
            </Heading>
            <Text size="lg">
              Make your assets work harder for your rewards. Get involved.
            </Text>
          </div>

          {liqidityProviders}
        </section>
        <section className="provide-liquidity-right">
          <img src="/images/doubleDollarCoins.svg" />
        </section>
      </div>
    </Card>
  );
};

export default ProvideLiquidity;
