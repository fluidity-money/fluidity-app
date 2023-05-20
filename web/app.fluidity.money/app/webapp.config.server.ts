import { parse } from "toml";
import { readFileSync } from "fs";
import { resolve, join } from "path";
import sharp from "sharp";
import z, { string, ZodString } from "zod";

const envVar = () => {
  return {
    default: (key: ZodString) =>
      string()
        .default(`${key}`)
        .transform((key: string): string => process.env[key] ?? ""),
  };
};

const OptionsSchema = z.object({
  drivers: z.object({}).catchall(
    z
      .array(
        z.object({
          label: z.string(),
          testnet: z.boolean(),
          rpc: z.object({
            http: envVar().default(z.string()),
            ws: envVar().default(z.string()),
          }),
          secret: envVar().default(z.string()).optional(),
          server: z.string().optional(),
        })
      )
      .min(1)
  ),
  config: z.object({}).catchall(
    z.object({
      explorer: z.string(),
      fluidAssets: z.array(z.string()),
      tokens: z
        .array(
          z.object({
            symbol: z.string(),
            name: z.string(),
            logo: z.string(),
            address: z.string(),
            colour: z.string(),
            isFluidOf: z.string().optional(),
            obligationAccount: z.string().optional(),
            dataAccount: z.string().optional(),
            decimals: z.number(),
            userMintLimit: z.number().optional(),
          })
        )
        .min(1),
      wallets: z
        .array(
          z.object({
            name: z.string(),
            id: z.string(),
            description: z.string().optional(),
            logo: z.string(),
          })
        )
        .optional(),
    })
  ),
  liquidity_providers: z.object({}).catchall(
    z.object({
      providers: z
        .array(
          z.object({
            name: z.string(),
            link: z.object({
              fUSDC: z.string().optional(),
              fUSDT: z.string().optional(),
              fTUSD: z.string().optional(),
              fFRAX: z.string().optional(),
              fDAI: z.string().optional(),
            }),
          })
        )
        .min(1),
    })
  ),
  contract: z.object({
    prize_pool: z.object({
      ethereum: z.string(),
      arbitrum: z.string(),
      solana: z.string(),
    }),
    eac_aggregator_proxy: z.object({
      ethereum: z.string(),
      arbitrum: z.string(),
      solana: z.string(),
    }),
  }),
});

export type Options = z.infer<typeof OptionsSchema>;

const options = OptionsSchema.parse(
  parse(readFileSync(resolve(__dirname, "../config.toml"), "utf8"))
);

export type ColorMap = { [network: string]: { [symbol: string]: string } };

const getColors = async () => {
  const networks = [];
  for (const network of Object.keys(options.config)) {
    const tokenColors = [];
    for (const { symbol, logo } of options.config[network].tokens) {
      const colors =
        process.env.NODE_ENV === "test"
          ? Buffer.from([255, 255, 255, 0])
          : await sharp(join(__dirname, "../public", logo))
              .resize(1, 1)
              .raw()
              .toBuffer();
      tokenColors.push({
        symbol,
        color: `#${colors.toString("hex").substring(0, 6)}`,
      });
    }
    const colorsMap = tokenColors.reduce(
      (acc: { [i: string]: string }, { symbol, color }) => {
        acc[symbol] = color;
        return acc;
      },
      {}
    );
    networks.push({
      network,
      colorsMap,
    });
  }

  return networks.reduce<ColorMap>(
    (acc: { [i: string]: { [i: string]: string } }, { network, colorsMap }) => {
      acc[network] = colorsMap;
      return acc;
    },
    {}
  );
};

// choose a random entry from a comma-separated string
const randomFromCommaSeparated = (s: string) => {
  const split = s.split(",");
  return split[Math.floor(Math.random() * split.length)];
};

// use a random driver for RPC to mitigate crashes
// from an unreliable endpoint
options.drivers = Object.fromEntries(
  Object.entries(options.drivers).map(([name, drivers]) => [
    name,
    drivers.map((driver) => ({
      ...driver,
      rpc: {
        http: randomFromCommaSeparated(driver.rpc.http),
        ws: randomFromCommaSeparated(driver.rpc.ws),
      },
    })),
  ])
);

export const colors = getColors();
export default options;
