import FluidityFacadeContext from "contexts/FluidityFacade";
import { useContext, useEffect } from "react"
import { CollapsibleCard } from "@fluidity-money/surfing"
import { useFetcher, useParams } from "@remix-run/react"

const FluidAssets = () => {
  const { balance } = useContext(FluidityFacadeContext)

  // const bal =  balance('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB4')
  // query /ethereum/query/userTransactions?address=[address]&page=1 and limit it to the first 3 responses
  const { connected, tokens } = useContext(FluidityFacadeContext)
  const { network } = useParams()

  const address = "0x6221a9c005f6e47eb398fd867784cacfdcfff4e7" // Test Address

  // const userTransactionsData = useFetcher()

  // useEffect(() => {
  //   if (!address) return

  //   userTransactionsData.load(
  //     `/${network}/query/userTransactions?page=1&address=${address}`
  //   )
  // }, [address]);

  return (
    <>
      <h1>Fluid Assets</h1>
      <pre id="json">
        {/* <code>{JSON.stringify(userTransactionsData)}</code> */}
      </pre>
      {/* <CollapsibleCard /> */}
    </>
  );
};

export default FluidAssets;
