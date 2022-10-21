import { Card, Heading, Text } from "@fluidity-money/surfing";
import { motion } from "framer-motion";

const parent = {
  variantA: { scale: 1 },
  variantB: { scale: 1 },
};

const child = {
  variantA: { scale: 1 },
  variantB: { scale: 1.05 },
};

interface IProps {
  network: string;
}

const ProvideLiquidity = ({ network }: IProps) => {
  const providers = network === "ethereum" ? ethProviders : solProviders;

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

const ethProviders = [
  {
    name: "uniswap",
    img: "/images/providers/Uniswap.svg",
    link: "https://www.uniswap.org/",
  },
  {
    name: "sushiswap",
    img: "/images/providers/Sushiswap.svg",
    link: "https://www.sushi.com/",
  },
  {
    name: "dodo",
    img: "/images/providers/DODO.png",
    link: "https://www.dodoex.io/",
  },
];

const solProviders = [
  {
    name: "solend",
    img: "/images/providers/solend.png",
    link: "https://www.solend.fi/",
  },
  {
    name: "orca",
    img: "/images/providers/Orca.svg",
    link: "https://www.orca.so/",
  },
  {
    name: "saber",
    img: "/images/providers/saber.svg",
    link: "https://www.saber.so/",
  },
  {
    name: "jupiter",
    img: "/images/providers/Jupiter.svg",
    link: "https://www.jup.ag/",
  },
];
