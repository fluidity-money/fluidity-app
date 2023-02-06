import { Token } from "~/util/chainUtils/tokens";
import { LoaderFunction } from "@remix-run/node";
import serverConfig from "~/webapp.config.server";
import { useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { CollapsibleCard, TokenCard } from "@fluidity-money/surfing";

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

export const ErrorBoundary: React.FC<{error: Error}> = (props: {error: Error}) => {
  return (
    <div>
      <h1>Error</h1>
      <p>{props.error.message}</p>
      <p>The stack trace is:</p>
      <pre>{props.error.stack}</pre>
    </div>
  );
}

const RegularAssets = () => {
  const { tokens } = useLoaderData<LoaderData>();

  return (
    <>
      <Suspense fallback={'loading'}>
        {
          tokens.map((t, i) => {
            return <CardWrapper key={i} token={t}/>
          })
        }
      </Suspense>
    </>
  )
}

const CardWrapper: React.FC<{ token: Token }> = (props: { token: Token }) => {
  const { token } = props;

  return (
    <div style={{marginBottom: '1em'}}>
      <CollapsibleCard
        expanded={false}
        type='box'
      >
        <CollapsibleCard.Summary>
          <TokenCard 
            token={token}
            fluidAmt={0}
            regAmt={0}
            value={0}
          />
        </CollapsibleCard.Summary>
      </CollapsibleCard>
    </div>
  )
}

export default RegularAssets