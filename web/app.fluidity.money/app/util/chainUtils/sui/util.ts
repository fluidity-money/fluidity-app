import { useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit"
import { TransactionBlock } from "@mysten/sui.js/transactions"
import { SuiClient } from "@mysten/sui.js/client"
import BN from "bn.js"
import { Token } from "../tokens"
import { default as suiAddresses } from "./addresses.json"

type suiType = `${string}::${string}::${string}`

const isSuiTypeName = (t?: string): t is suiType =>
  !!t && /^.+::.+::.+$/g.test(t)

const contractTarget = (address: string, action: 'wrap' | 'unwrap') => `${address}::fluidity_coin::${action}` as const

const internalSwap = async (suiClient: SuiClient, address: string | undefined, amount: string, fromToken: Token, toToken: Token, signAndExecuteTransactionBlock: ReturnType<typeof useSignAndExecuteTransactionBlock>['mutate']) => {
  if (!address)
    return
  /*
   * if fromFluid, we are unwrapping (fromToken is fluid, toToken is nonfluid)
   * want to splitCoins(fluidToken) then use that
   *
   * if !fromFluid, we are wrapping (fromToken is nonfluid, toToken is fluid)
   * want to splitCoins(nonfluidToken) then use that
   */
  const fromFluid = !!fromToken.isFluidOf;
  // get the type of the send token to find coins to swap
  // and the non-fluid token to pass as a type argument to wrap/unwrap
  const { address: fluidTokenAddress } = fromFluid ? fromToken : toToken
  const { suiTypeName: nonFluidTypeName } = fromFluid ? toToken : fromToken
  const { suiTypeName: fromTokenTypeName } = fromToken

  if (!isSuiTypeName(nonFluidTypeName)) return

  // find sender coins in the user's wallet
  const { data: coins } = await suiClient.getCoins({ owner: address, coinType: fromTokenTypeName })

  const txb = new TransactionBlock()

  // if balance of the first coin isn't enough, merge others into it first
  const amountBig = new BN(amount)
  let balance = new BN(0)
  let i = 0
  // determine the balance
  while (balance.lt(amountBig) && (i < coins.length)) {
    const b = new BN(coins[i].balance)
    balance = balance.add(b)
    i++;
  }

  // didn't have enough
  if (balance.lt(amountBig)) {
    throw new Error(`balance was not sufficient! wanted ${amountBig.toString()}, had ${balance.toString()}`)
  }

  // get the first coin to use, or merge into
  const [{ coinObjectId: firstCoinId }] = coins

  // need to merge coins
  if (i > 1) {
    txb.mergeCoins(firstCoinId, coins.slice(1, i).map(coin => coin.coinObjectId))
  }

  // look up the required accounts
  const key = (fromToken.symbol.startsWith('f') ? toToken.symbol : fromToken.symbol) as keyof typeof suiAddresses.mainnet

  const { mainnet: { [key]: {
    global_vault: globalVault,
    user_vault: userVault,
    prize_pool_vault: prizePoolVault,
    coin_reserve: coinReserve,
    scallop_version: scallopVersion,
    scallop_market: scallopMarket,
    clock,
  }
  } } = suiAddresses;

  const [coin] = txb.splitCoins(firstCoinId, [txb.pure(amount)])
  txb.setSender(address)

  // wrapping
  if (!fromFluid) {
    txb.moveCall({
      arguments: [
        // global
        txb.object(globalVault),
        // user vault
        txb.object(userVault),
        // coin reserve
        txb.object(coinReserve),
        // scallop version
        txb.object(scallopVersion),
        // scallop market
        txb.object(scallopMarket),
        // clock
        txb.object(clock),
        // coin,
        coin,
      ],
      typeArguments: [nonFluidTypeName],
      target: contractTarget(fluidTokenAddress, 'wrap')
    });
    // unwrapping
  } else {
    txb.moveCall({
      arguments: [
        // global
        txb.object(globalVault),
        // coin
        coin,
        // user vault
        txb.object(userVault),
        // prize pool vault
        txb.object(prizePoolVault),
        // coin reserve
        txb.object(coinReserve),
        // scallop version
        txb.object(scallopVersion),
        // scallop market
        txb.object(scallopMarket),
        // clock
        txb.object(clock),
      ],
      typeArguments: [nonFluidTypeName],
      target: contractTarget(fluidTokenAddress, 'unwrap')
    });
  }

  await txb.build({ client: suiClient })

  // get the digest out of the signing callback
  const digest = await new Promise<string>(resolve => {
    signAndExecuteTransactionBlock({ transactionBlock: txb }, {
      onError: (_ => {
        resolve("")
      }),
      onSuccess: (result => {
        resolve(result.digest)
      })
    })
  })

  return {
    confirmTx: async () => {
      if (!digest) return false
      // if the block doesn't exist, this will time out
      const transactionBlock = await suiClient.waitForTransactionBlock({ digest })
      return !!(transactionBlock)
    },
    txHash: digest,
  };
}

const getBalance = async (suiClient: SuiClient, owner: string | undefined, coinType: string): Promise<BN> => {
  if (!owner)
    return new BN(0)

  const { totalBalance } = await suiClient.getBalance({ owner, coinType })
  return new BN(totalBalance)
}


export {
  internalSwap,
  getBalance,
}
