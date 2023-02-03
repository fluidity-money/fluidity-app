import FluidityFacadeContext from "contexts/FluidityFacade";
import { Suspense, useContext, useEffect, useMemo, useState } from "react"
import { CollapsibleCard, TokenCard, TokenDetails } from "@fluidity-money/surfing"
import { useLoaderData, useParams } from "@remix-run/react"
import { getUsdFromTokenAmount, Token } from "~/util/chainUtils/tokens";
import { LoaderFunction } from "@remix-run/node";
import serverConfig from "~/webapp.config.server";
import { useCache } from "~/hooks/useCache";
import { ErrorBoundary as SentryErrorBoundary } from "@sentry/react";
import BN from "bn.js";
import { ITokenStatistics } from "../../query/dashboard/assets";

export const loader: LoaderFunction = async ({ params }) => {
  const { network } = params;
  const { tokens } =
    serverConfig.config[network as unknown as string] ?? {};

  return {
    tokens,
  };
};

type LoaderData = {
  tokens: Token[]
}

interface ITempErrorMessage {
  error: Error
}

const TempErrorMessage: React.FC<ITempErrorMessage> = (props: ITempErrorMessage) => {
  const { error } = props
  return (
    <div>
      <h1>Error</h1>
      <p>{error.message}</p>
      <pre>{JSON.stringify(error)}</pre>
      <p>The stack trace is:</p>
      <pre>{error.stack}</pre>
    </div>
  );
}

type e = {error: Error}

export const ErrorBoundary: React.FC<e> = (props: e) => {
  return (
    <div>
      <h1>Error</h1>
      <p>{props.error.message}</p>
      <p>The stack trace is:</p>
      <pre>{props.error.stack}</pre>
    </div>
  );
}

const FluidAssets = () => {

  // get the tokens from the loader
  const { tokens } = useLoaderData<LoaderData>();

  return (
    <>
      <SentryErrorBoundary fallback={(err) => <TempErrorMessage error={err.error} />}>
        <Suspense  fallback={'loading'}>
          {
            tokens.map((t, i) => {
              return  <CardWrapper key={i} token={t} />
            })
          }
        </Suspense>
      </SentryErrorBoundary>
    </>
  );
};

interface ICardWrapper {
  token: Token
}

type Quantities = {
  fluidAmt: BN | undefined
  regAmt: BN | undefined
}

const CardWrapper: React.FC<ICardWrapper> = (props: ICardWrapper) => {

  const { token } = props
  const { tokens } = useLoaderData<LoaderData>();

  const regularToken = useMemo(() => tokens.find((t) => t.address === token.isFluidOf), [token, tokens])

  const { network } = useParams()
  const { connected, balance } = useContext(FluidityFacadeContext)

  const [quantities, setQuantities] = useState<Quantities>({fluidAmt: new BN(0), regAmt: new BN(0)})

  const regularContract = regularToken?.address

  if (!network) return <div></div>
  if (!regularContract) return <div></div>

  useEffect(() => {
    if (!connected) return

    (async () => {
      const [fluidAmt, regAmt] = await Promise.all([
        balance?.(token.address),
        balance?.(regularContract)
      ])

      setQuantities({
        fluidAmt: fluidAmt || new BN(0),
        regAmt: regAmt || new BN(0)
      })
    })()

  }, [connected])

  const address = "0x6221a9c005f6e47eb398fd867784cacfdcfff4e7" // Test address

  const { data } = useCache<ITokenStatistics>(address ? `/${network}/query/dashboard/assets?address=${address}&token=${regularToken.symbol}` : '', true)

  if (!data) return <div></div>

  const { topPrize, avgPrize, topAssetPrize, activity } = data

  const decimals = new BN(10).pow(new BN(token.decimals))

  return (
    <CollapsibleCard expanded={true}>
      <CollapsibleCard.Summary>
        <TokenCard 
          token={token}
          fluidAmt={quantities.fluidAmt?.div(decimals).toNumber() || 0}
          regAmt={quantities.regAmt?.div(decimals).toNumber() || 0}
          value={getUsdFromTokenAmount(quantities.fluidAmt as BN, token)}
        />
      </CollapsibleCard.Summary>
      <CollapsibleCard.Details>
        <TokenDetails 
          topPrize={{
            winning_amount: topPrize.winning_amount / 10 ** token.decimals,
            transaction_hash: topPrize.transaction_hash
          }}
          avgPrize={avgPrize / 10 ** token.decimals}
          topAssetPrize={{
            winning_amount: topAssetPrize.winning_amount / 10 ** token.decimals,
            transaction_hash: topAssetPrize.transaction_hash
          }}
          activity={activity}
        />
      </CollapsibleCard.Details>
    </CollapsibleCard>
  )
}

export default FluidAssets;
