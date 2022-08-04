# Integrations testing (Ethereum)

Contains files for testing application integrations on Ethereum. Can be used to
test expected values of new integrations, as well as regression testing of existing
integrations. Uses Docker Compose to build and bring up the testing files as well as
necessary services, and Go's testing infrastructure to perform the actual tests.
Application-specific tests (e.g. special failure cases, testing non-exported functions)
should be performed individually using normal Go testing principles, i.e. `file.go`,
`file_test.go` within that integration's folder.

## How to run

Obtain an HTTP Infura endpoint URL, then in `tests/integrations/ethereum`:

`FLU_ETHEREUM_HTTP_URL=<infura url> ./run.sh` 

With no arguments passed, the default is to run all tests. Otherwise, arguments are passed
to Compose.

## Adding new tests

Tests are obtained from JSON strings representing example transfers, and containing
their expected outputs. New tests should be added as JSON strings into an 
application-specific file, based on the type `integrationTest` as defined in `main_test.go`. 
Then, in `main_test.go`, expand the `init()` function to include the new tests as follows:

```go
func init() {
  // ...
  // ...
    
  myTests := unmarshalJsonTestOrFatal(integrationTestMyIntegration)
  tests = append(tests, myTests...)
}
```

### Quick(ish) Start

Given a Transaction Hash and Log Signature, run: 
`tests/integrations/ethereum/util/createTestString.go <TxHash> <LogSignature> | jq`
Keep in mind all outputs must be manually validated! (Notably Check contract matches desired integration)

### Struct Definition
```
[
  {
    "transfer": {
      "log": {
        "data": BASE64 ENCODED Log Data
        "address": Contract Address - VALIDATE
        "topics": [
          Log Topics
        ]
      },
      "transaction": {
        "to": Instruction Receiver
        "from": Instruction Sender
        "hash": Tx Hash
      },
      "application": Must Match Enum found in common/ethereum/applications/applications.go
    },
    "expected_sender": Sender of input token
    "expected_recipient": Receiver of input token
    "expected_fees": Calculated Fee (Adjusted for Mock Fluid Token decimals)
    "token_decimals": Mock Fluid Token Decimals
    "contract_address": Mock Fluid Token Address
  }
  ... Repeat Tests
]
````

