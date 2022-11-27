# 🎍 EVM ABIs

The following ABIs can be compiled in the [repository](https://github.com/fluidity-money/fluidity-app/) (using `make build`.)

### Token

{% embed url="https://github.com/fluidity-money/fluidity-app/blob/develop/contracts/ethereum/contracts/Token.sol" %}
Source code
{% endembed %}

The Token is an ERC20-compatible contract featuring swap-in (`swapIn`) and swap-out (`swapOut`) features. Tokens include fUSDT, fUSDC and fDAI.

### LiquidityProvider

{% embed url="https://github.com/fluidity-money/fluidity-app/blob/develop/contracts/ethereum/contracts/LiquidityProvider.sol" %}
Source code
{% endembed %}

Interface that contains liquidity tokens to redeem for the underlying based on the implementation.

### AAVE v2 LiquidityProvider

{% embed url="https://github.com/fluidity-money/fluidity-app/blob/develop/contracts/ethereum/contracts/AaveV2LiquidityProvider.sol" %}
Source code
{% endembed %}

LiquidityProvider frontend for AAVE.

### AAVE v3 LiquidityProvider

{% embed url="https://github.com/fluidity-money/fluidity-app/blob/develop/contracts/ethereum/contracts/AaveV3LiquidityProvider.sol" %}
Source code
{% endembed %}

LiquidityProvider frontend for AAVE, this time for version 3.

### Compound LiquidityProvider

{% embed url="https://github.com/fluidity-money/fluidity-app/blob/develop/contracts/ethereum/contracts/CompoundLiquidityProvider.sol" %}

LiquidityProvider frontend for Compound.

### Worker config

{% embed url="https://github.com/fluidity-money/fluidity-app/blob/develop/contracts/ethereum/contracts/WorkerConfig.sol" %}
Source code
{% endembed %}

The worker config is a single contract deployed which is referred to by the various deployed Tokens to get information on the RNG oracle and global emergency status.
