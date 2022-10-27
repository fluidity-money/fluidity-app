import { Outlet, useParams } from "@remix-run/react";
import EthereumProvider from "contexts/EthereumProvider";
import { Fragment } from "react";

type ProviderMap = {
  [key: string]: ((props: {children: React.ReactNode}) => JSX.Element) | undefined;
}

const Provider = ({ network, children }: { network?: string, children: React.ReactNode }) => {
  const providers: ProviderMap = {
    ethereum: EthereumProvider,
    //solana: SolanaProvider,
  }

  const ProviderComponent = (network && providers[network]) || Fragment;

  return <ProviderComponent>
    {children}
  </ProviderComponent>
}
export default function Network() {
  const { network } = useParams();
  return (
    <Provider network={network}>
      <Outlet />
    </Provider>
  );
}
