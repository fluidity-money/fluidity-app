# 💠 Ethereum contract architecture

Ethereum support is built as a trio of contracts:

1. Token - the token for the wrapped asset being traded/transferred, supporting swapping in, swapping out, ERC20 features
2. WorkerConfig - configuration for each token
3. LiquidityProvider - abstract wrapper that holds custody of ctokens/atokens

<figure><img src="https://fluidity.money/gitbook-content/ethereum-diagram.png" alt=""><figcaption><p>Ethereum high level</p></figcaption></figure>

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

#### Batch reward process (batchReward)

1. Worker sends to the Token a batch of winners and the span of blocks that was won
2. Token aggregates the amounts that should be paid out to each winner
3. Token aggregates the remaining pool amount
4. Token rewards each user with the internal reward function `rewardPool`

#### Manual reward process (manualReward)

1. User identifies that they won a small reward by accessing an endpoint on the webapp
2. Webapp generates a signature of random numbers and the first and last block for the end user to supply to the function
3. User calls the function from the webapp
4. Token validates the signature produced by the webapp
5. Token tracks the amount the user won for the block period
6. Token rewards the user with the internal reward function (`rewardPool`)

#### Reward pool amount calculation (rewardPool)

1. LiquidityProvider calculates the balance of the underlying assets based on the exchange rate of the cTokens/aTokens held in the Compound/AAVE pool&#x20;
2. Token calculates the difference between the amount deposited by users with the amount reported by the LiquidityProvider for the prize pool amount
3. Token calls the reward from pool function (`rewardFromPool`) - which simply calls the mint function and emits a log

