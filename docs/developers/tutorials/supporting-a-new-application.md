---
description: Brief overview of integrating fee calculation for a new application
---

# 👩💻 Supporting a New Application

* Obtain the address of the Fluid pool(/s) or other Fluid-related contracts for the application. Add to the application server's `mainnet.yml` (e.g. `automation/arbitrum/application-server/mainnet.yml`) in the format described by the application server README.md, i.e. `app_name:addr1,addrn,...`
* Determine the event emitted by the pool contract when a application interaction is made. Often this will have a name like "Swap" or "Swapped". Note the log topic of this event, as well as its ABI.
* Create the directory `common/ethereum/applications/<app_name>`, containing `init.go` and `<app_name>.go`. `init.go` should initialise an ABI object to decode relevant events, and `<app_name>.go` should contain function(/s) to calculate volume and fees for application events.
* Create a function as above that decodes application events and determines their volume and fee amounts. Ensure events are filtered by the contract/fluid token address and log topic.
* Update types to include the new application
  * `common/ethereum/applications/applications.go` enum
  * Timescale ethereum\_application enum
  * Worker emissions Timescale type
  * Worker emissions Go type (`EthereumAppFees` in `lib/types/worker/worker.go`)
* Update `GetApplicationFee` in `common/ethereum/applications/applications.go` to return fee data for the new application
* Update `GetApplicationTransferParties` in `common/ethereum/applications/applications.go` to return sender/recipient data for the new application
* Write an integration test
  * Add a JSON encoded test to `tests/integrations/ethereum/<app_name>.go`, then append it to the test suite in `tests/integrations/ethereum/main_test.go`
  * JSON test includes an encoded transfer, expected values (sender, recipient, fee, volume, emission), and mocked RPC responses for contract calls
