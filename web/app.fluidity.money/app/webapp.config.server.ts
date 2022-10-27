import { parse } from "toml";
import { readFileSync } from "fs";
import { resolve, join } from "path";
import z from "zod";
import sharp from "sharp";

const OptionsSchema = z.object({
  drivers: z.object({}).catchall(
    z
      .array(
        z.object({
          label: z.string(),
          testnet: z.boolean(),
          rpc: z.object({
            http: z.string(),
            ws: z.string(),
          }),
        })
      )
      .min(1)
  ),
  config: z.object({}).catchall(
    z.object({
      fluidAssets: z.array(z.string()),
      tokens: z
        .array(
          z.object({
            symbol: z.string(),
            name: z.string(),
            logo: z.string(),
            address: z.string(),
            isFluidOf: z.string().optional(),
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
});

export type Options = z.infer<typeof OptionsSchema>;

const options = OptionsSchema.parse(
  parse(readFileSync(resolve(__dirname, "../config.toml"), "utf8"))
);

type ColorMap = { [network: string]: { [symbol: string]: string } };

const getColors = async () => {
  console.log("🎨 Getting colors from icons... Just sit tight for a moment.");

  const networks = [];
  for (const network of Object.keys(options.config)) {
    const tokenColors = [];
    for (const { symbol, logo } of options.config[network].tokens) {
      const colors = await sharp(join(__dirname, "../public", logo))
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

  console.log("🖍️ Done getting colors from icons!");
  return networks.reduce<ColorMap>(
    (acc: { [i: string]: { [i: string]: string } }, { network, colorsMap }) => {
      acc[network] = colorsMap;
      return acc;
    },
    {}
  );
};

export const colors = getColors();

export default options;
