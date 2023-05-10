
import { mainDeployTransparentUpgradeableProxy } from "./transparent-upgradeable-proxy";

mainDeployTransparentUpgradeableProxy(
  "Registry",
  [ "FLU_ETHEREUM_OPERATOR_ADDRESS" ]
).then(_ => {});
