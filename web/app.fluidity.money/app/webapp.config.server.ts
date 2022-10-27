import { parse } from "toml";
import { readFileSync } from "fs";
import { resolve } from "path";
import z, {string} from "zod";

const envVar = () => {
  return {
    default: (key: string) =>
      string()
        .default(`${key}`)
        .transform((key: string): string => process.env[key] ?? "")
  }
}

const OptionsSchema = z.object({
  drivers: z.object({}).catchall(
    z
      .array(
        z.object({
          label: z.string(),
          testnet: z.boolean(),
          rpc: z.object({
            http: envVar().default("FLU_RPC_HTTP"),
            ws: envVar().default("FLU_RPC_WS"),
          }),
          server: z.string(),
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
            colour: z.string(),
            isFluidOf: z.string().optional(),
          })
        )
        .min(1),
    })
  ),
  liquidity_providers: z.object({}).catchall(
    z.object({
      providers: z
        .array(
          z.object({
            name: z.string(),
            img: z.string(),
            link: z.string(),
          })
        )
        .min(1),
    })
  ),
  provider_icons: z.object({
    Aave: z.string(),
    Aldrin: z.string(),
    Circle: z.string(),
    Compound: z.string(),
    Dodo: z.string(),
    Jupiter: z.string(),
    Lemniscap: z.string(),
    Maker: z.string(),
    Multicoin: z.string(),
    Orca: z.string(),
    Polygon: z.string(),
    Saber: z.string(),
    Solana: z.string(),
    Solend: z.string(),
    Uniswap: z.string(),
    Sushiswap: z.string(),
  }),
});

export type Options = z.infer<typeof OptionsSchema>;

const options = OptionsSchema.parse(
  parse(readFileSync(resolve(__dirname, "../config.toml"), "utf8"))
);

export default options;
