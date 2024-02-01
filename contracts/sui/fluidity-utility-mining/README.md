# Install Dependencies

```shell
npm install
```

# Build Move contract

```shell
sui move build
```

# Test Move contract

```shell
sui move test
```

# Deploy Move contract

```shell
sui client publish --gas-budget 800000000 --skip-dependency-verification
```

# Run test script

```shell
node test/createCoinReserve.js
node test/addToReserve.js <amount>
node test/distributeFromReserve.js <recipientAddress> <amount>
```
