# 🔮 Oracle Key Rotation

### Ethereum

The `WorkerConfig` contract stores a list of oracle addresses. Each address corresponds to a different token contract (e.g. fUSDC, fDAI), and is the payout authority for that token. Oracle private keys are stored in secure AWS parameters, and are rotated on a regular basis. The rotation flow is as follows:

* AWS Lambda is triggered by a timer, then for each token it:
  * Creates a new private key
  * Signs the new address with the existing private key
  * Uploads the new private key to AWS
  * Uploads a log of the change, including the signature, to an S3 bucket

The 20 byte Ethereum address is signed after being left-padded to 32 bytes using the `Address.Hash()` method in Go Ethereum.

Once the lambda has executed, the Fluidity Multisig account holders then manually create and sends a transaction that calls `updateOracles()` in the `WorkerConfig` contract to be in line with the new keys in AWS.&#x20;

The signature stored in S3 is later made public as proof of our continued custody of the keys.&#x20;
