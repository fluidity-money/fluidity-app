
import { mainDeployTransparentUpgradeableProxy } from "./transparent-upgradeable-proxy";

mainDeployTransparentUpgradeableProxy(
  "Executor",
  [
    `FLU_ETHEREUM_OPERATOR_ADDRESS`,
    `FLU_ETHEREUM_EMERGENCY_COUNCIL_ADDRESS`,
    `FLU_ETHEREUM_REGISTRY_ADDRESS`
  ]
).then(_ => {});
