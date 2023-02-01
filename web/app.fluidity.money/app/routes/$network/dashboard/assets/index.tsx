import FluidityFacadeContext from "contexts/FluidityFacade";
import { Suspense, useContext, useEffect, useState } from "react"
import { CollapsibleCard } from "@fluidity-money/surfing"
import { useFetcher, useLoaderData, useParams } from "@remix-run/react"
import { getTokenFromSymbol, getUsdFromTokenAmount, Token } from "~/util/chainUtils/tokens";
import { LoaderFunction } from "@remix-run/node";
import serverConfig from "~/webapp.config.server";
import useSWR from "swr";
import { useCache } from "~/hooks/useCache";
import { RemixErrorBoundary } from "@remix-run/react/dist/errorBoundaries";
import { ErrorBoundary as SentryErrorBoundary } from "@sentry/react";
import { useRouteError } from "react-router-dom";
import BN from "bn.js";

export const loader: LoaderFunction = async ({ params }) => {
  const { network } = params;
  const { tokens } =
    serverConfig.config[network as unknown as string] ?? {};

  const fluidTokens = tokens.filter((token) => token.isFluidOf !== undefined);

  return {
    tokens: fluidTokens,
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
      <h1>Fluid Assets</h1>
      <pre id="json">
        {/* <code>{connected && 'hello'}</code> */}
        {/* <code>
          {JSON.stringify(tokens, null, 2)}
        </code> */}
        <SentryErrorBoundary fallback={(err) => <TempErrorMessage error={err.error} />}>
          <Suspense  fallback={'loading'}>
            {
              tokens.map((t, i) => {
                return  <CardWrapper key={i} token={t} />
              })
            }
          </Suspense>
        </SentryErrorBoundary>
      </pre>
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

  const { network } = useParams()
  const { connected, balance, address } = useContext(FluidityFacadeContext)

  const tokenAmt = balance?.(token.address)

  const [quantities, setQuantities] = useState<Quantities>({fluidAmt: new BN(0), regAmt: new BN(0)})

  const regularContract: string = token.isFluidOf as string

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

  // const address = "0x6221a9c005f6e47eb398fd867784cacfdcfff4e7" // Test address

  const { data } = useCache(address ? `/${network}/query/dashboard/assets?address=${address}&token=USDT` : '', true)
  console.log('data', data)

  return<>
    <h1>{token.symbol}</h1> 
    Token address: {token.address}<br/>
    Token balance: {quantities.fluidAmt?.toString()}<br/>
    Regular address: {JSON.stringify(token.isFluidOf)}
    Token balance: {quantities.regAmt?.toString()}<br/>
    USD: {getUsdFromTokenAmount(quantities.fluidAmt as BN, token)}
    USD (reg): {getUsdFromTokenAmount(quantities.regAmt as BN, token)}
    {connected && <p>Connected</p>}
    <pre>
      <code>
        {JSON.stringify(data, null, 2)}
        {JSON.stringify(quantities, null, 2)}
      </code>
    </pre>
  </>
}

export default FluidAssets;
