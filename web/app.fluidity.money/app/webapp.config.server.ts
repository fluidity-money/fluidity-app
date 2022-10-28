import { parse } from "toml";
import { readFileSync } from "fs";
import { resolve } from "path";
import z, { string } from "zod";

const envVar = () => {
  return {
    default: (key: string) =>
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
});

export type Options = z.infer<typeof OptionsSchema>;

const options = OptionsSchema.parse(
  parse(readFileSync(resolve(__dirname, "../config.toml"), "utf8"))
);

export default options;
