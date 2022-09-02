# 💠 Ethereum contract architecture

Ethereum support is built as a trio of contracts:

1. Token - the token for the wrapped asset being traded/transferred, supporting swapping in, swapping out, ERC20 features
2. WorkerConfig - configuration for each token
3. LiquidityProvider - abstract wrapper that holds custody of ctokens/atokens

<figure><img src="https://fluidity.money/gitbook-cdn/ethereum-diagram.png" alt=""><figcaption><p>Ethereum high level</p></figcaption></figure>

### Features in pseudocode form

#### Wrapping in/swapping in (erc20In)

1. Token takes the user's unwrapped tokens and moves it into the contract
2. Token sends the unwrapped tokens to the LiquidityProvider
3. LiquidityProvider provides it to the underlying liquidity provider (Compound or AAVE)
4. Underlying liquidity provider (Compound/AAVE) mints cToken/aToken with the amount given
5. LiquidityProvider receives cToken/aToken adjusted to the "exchange rate" of the cToken/aToken (unwrapped token/exchange rate)
6. Token sends the user an amount equal to the initial unwrapped token of the Fluid Asset form using the mint function

#### Wrapping out/swapping out (erc20Out)

1. Token burns the minted amount owed to the user wrapping out of the contract
2. Underlying LiquidityProvider "redeems" the amount of token that the user wishes to unwrap - the underlying redemption process (Compound/AAVE) calculates the amount owed using the amount of the cToken/aToken - on Compound this is cToken \* exchange rate
3. The LiquidityProvider sends the Token the amount redeemed
4. The Token sends the user their unwrapped asset after redemption

