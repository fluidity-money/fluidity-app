import {
  Actions,
  AddEthereumChainParameter,
  Connector,
  Provider,
  ProviderRpcError,
} from "@web3-react/types";

export type Coin98Provider = {
  isCoin98Wallet: boolean;
} & Provider;

export class NoCoin98Error extends Error {
  public constructor() {
    super("Coin98 not installed");
    this.name = NoCoin98Error.name;
    Object.setPrototypeOf(this, NoCoin98Error.prototype);
  }
}

function parseChainId(chainId: string) {
  return Number.parseInt(chainId, 16);
}

type Coin98ConstructorArgs = {
  actions: Actions;
  onError?: (error: Error) => void;
};

export class Coin98Connector extends Connector {

  private eagerConnection?: Promise<void>;

  constructor({ actions, onError }: Coin98ConstructorArgs) {
    super(actions, onError);
  }

  private async isomorphicInitialize(): Promise<void> {
    if (this.eagerConnection) return;

    return (this.eagerConnection = Promise.resolve(
      (async () => {
        const provider = window.ethereum;

        if (provider) {
          this.provider = provider as Coin98Provider;
          this.provider?.on("connect", (): void => {
            this.actions.update({ chainId: 1 });
          });

          this.provider?.on("disconnect", (): void => {
            this.actions.resetState();
            this.provider = undefined;
          });

          this.provider?.on("chainChanged", ({ id }): void => {
            this.actions.update({ chainId: id });
          });

          this.provider?.on("accountsChanged", (accounts: string[]): void => {
            if (accounts.length === 0) {
              // handle this edge case by disconnecting
              this.actions.resetState();
            } else {
              this.actions.update({ accounts });
            }
          });
        }
      })()
    ));
  }

  /** {@inheritdoc Connector.connectEagerly} */
  public async connectEagerly(): Promise<void> {
    const cancelActivation = this.actions.startActivation();

    await this.isomorphicInitialize();
    if (!this.provider) return cancelActivation();

    return Promise.all([
      this.provider.request({ method: "eth_chainId" }) as Promise<string>,
      this.provider.request({ method: "eth_accounts" }) as Promise<string[]>,
    ])
      .then(([chainId, accounts]) => {
        if (accounts.length) {
          this.actions.update({ chainId: parseChainId(chainId), accounts });
        } else {
          throw new Error("No accounts returned");
        }
      })
      .catch((error) => {
        console.debug("Could not connect eagerly", error);
        // we should be able to use `cancelActivation` here, but on mobile, metamask emits a 'connect'
        // event, meaning that chainId is updated, and cancelActivation doesn't work because an intermediary
        // update has occurred, so we reset state instead
        this.actions.resetState();
      });
  }

  /**
   * Initiates a connection.
   *
   * @param desiredChainIdOrChainParameters - If defined, indicates the desired chain to connect to. If the user is
   * already connected to this chain, no additional steps will be taken. Otherwise, the user will be prompted to switch
   * to the chain, if one of two conditions is met: either they already have it added in their extension, or the
   * argument is of type AddEthereumChainParameter, in which case the user will be prompted to add the chain with the
   * specified parameters first, before being prompted to switch.
   */
  public async activate(
    desiredChainIdOrChainParameters?: number | AddEthereumChainParameter
  ): Promise<void> {
    let cancelActivation: () => void;
    if (!this.provider) cancelActivation = this.actions.startActivation();

    return this.isomorphicInitialize()
      .then(async () => {
        if (!this.provider) throw new NoCoin98Error();

        return Promise.all([
          this.provider.request({ method: "eth_chainId" }) as Promise<string>,
          this.provider.request({ method: "eth_requestAccounts" }) as Promise<
            string[]
          >,
        ]).then(([chainId, accounts]) => {
          const receivedChainId = parseChainId(chainId);
          const desiredChainId =
            typeof desiredChainIdOrChainParameters === "number"
              ? desiredChainIdOrChainParameters
              : desiredChainIdOrChainParameters?.chainId;

          // if there's no desired chain, or it's equal to the received, update
          if (!desiredChainId || receivedChainId === desiredChainId)
            return this.actions.update({ chainId: receivedChainId, accounts });

          const desiredChainIdHex = `0x${desiredChainId.toString(16)}`;

          // if we're here, we can try to switch networks
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return this.provider!.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: desiredChainIdHex }],
          })
            .catch((error: ProviderRpcError) => {
              if (
                error.code === 4902 &&
                typeof desiredChainIdOrChainParameters !== "number"
              ) {
                // if we're here, we can try to add a new network
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                return this.provider!.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      ...desiredChainIdOrChainParameters,
                      chainId: desiredChainIdHex,
                    },
                  ],
                });
              }

              throw error;
            })
            .then(() => this.activate(desiredChainId));
        });
      })
      .catch((error) => {
        cancelActivation?.();
        throw error;
      });
  }
}
