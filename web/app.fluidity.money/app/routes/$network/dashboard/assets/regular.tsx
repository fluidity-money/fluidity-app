import { Token } from "~/util/chainUtils/tokens";
import { LoaderFunction } from "@remix-run/node";
import serverConfig from "~/webapp.config.server";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ params }) => {
  const { network } = params;
  const { tokens } =
    serverConfig.config[network as unknown as string] ?? {};

  const fluidTokens = tokens.filter((token) => token.isFluidOf == undefined);

  return {
    tokens: fluidTokens,
  };
};

type LoaderData = {
  tokens: Token[]
}

const RegularAssets = () => {
  const { tokens } = useLoaderData<LoaderData>();

  return (
    <>
    <div>Regular Assets</div>
    <pre>
      <code>
        {JSON.stringify(tokens, null, 2)}
      </code>
    </pre>
    </>
  )
}
export default RegularAssets