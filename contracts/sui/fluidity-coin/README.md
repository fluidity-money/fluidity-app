# Build Move contract

```shell
sui move build
```

# Test Move contract

```shell
sui move test
```

# Configuring the deployment

Currently, the test/helpers/constants.js file is used. Make sure to set the token you want
to deploy for!

# Deploy Move contract

It is critical to carefully update the fluidity coin CoinMetadata when deploying the coin, such that it reflects the CoinMetadata of the underlying coin for which it wraps and unwraps.

```shell
sui client publish --gas-budget 800000000 --skip-dependency-verification
```

# Run test script

```shell
node test/initialize.js
node test/mint.js <AMOUNT>
node test/wrap.js <AMOUNT>
node test/unwrap.js
node test/burn.js
node test/emergencyDrain.js
node test/toggleStatusAdmin.js <action>
node test/toggleStatusDAO.js <action>
node distributeYield.js \"recipient1,recipient2\" \"amount1,amount2\"
```
