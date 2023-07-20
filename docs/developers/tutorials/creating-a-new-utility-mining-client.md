# ⛏ Creating a New Utility Mining Client



1. Deploy a contract implementing the interface `IFluidClient`. Essentially the client must implement `batchReward()` and `getUtilityVars()`, with the former emitting the event `Reward` for each reward paid out and the latter returning your desired utility variables.
2. Update the registry by calling `updateUtilityClients` in `Registry.sol`. This requires the above client, an address for the relevant token, and a name for the client. This call must be made by the operator, which is currently a centralised entity, with plans in the works to decentralise this responsibility to the DAO.
3. Update the automation used by the offchain worker. Namely, update `ENV_FLU_ETHEREUM_UTILITY_CONTRACTS` in the application server for the given network (`automation/<network>/application-server/mainnet.yml`) to include the client name and address as set in the previous step. In the worker server and spooler automation (`automation/<network>/worker-server/mainnet.yml` and `automation/<network>/worker-spooler/mainnet.yml` respectively), update `ENV_FLU_ETHEREUM_UTILITY_TOKEN_DETAILS` to include the client name, token name, and token decimals. For example, adding Wombat:

```diff

diff --git a/automation/arbitrum/application-server/mainnet.yml b/automation/arbitrum/application-server/mainnet.yml
--- a/automation/arbitrum/application-server/mainnet.yml
+++ b/automation/arbitrum/application-server/mainnet.yml
@@ -1,8 +1,8 @@
 DOCKER_IMAGE: microservice-arbitrum-application-server
 DOCKERFILE_PATH: ./cmd/microservice-ethereum-application-server
-ENV_FLU_ETHEREUM_UTILITY_CONTRACTS: 'chronos initial boost:0x0176416bdc885b1bb751b0a014d495760a972a73:0x62030690385A481Ab0c6039fEA75AC6658B7b961'
+ENV_FLU_ETHEREUM_UTILITY_CONTRACTS: 'chronos initial boost:0x0176416bdc885b1bb751b0a014d495760a972a73:0x62030690385A481Ab0c6039fEA75AC6658B7b961,wombat initial boost:0x956454c7be9318863297309183c79b793d370401'

diff --git a/automation/arbitrum/worker-server/mainnet.yml b/automation/arbitrum/worker-server/mainnet.yml
--- a/automation/arbitrum/worker-server/mainnet.yml
+++ b/automation/arbitrum/worker-server/mainnet.yml
@@ -10,7 +10,7 @@ SERVICES:
       SERVICE_NAME: microservice-arbitrum-worker-server-usdt
       ENV_FLU_WORKER_ID: arbitrum-microservice-arbitrum-worker-server-usdt
       ENV_FLU_ETHEREUM_CONTRACT_ADDR: "0xc9fa90d24b7103ad2215de52afec5e1e4c7a6e62"
-      ENV_FLU_ETHERUEM_UTILITY_TOKEN_DETAILS: "FLUID:USDT:6,chronos initial boost:USDC:6"
+      ENV_FLU_ETHERUEM_UTILITY_TOKEN_DETAILS: "FLUID:USDT:6,wombat initial boost:WOM:18,chronos initial boost:USDC:6"
       ENV_FLU_ETHEREUM_AMQP_QUEUE_NAME: arbitrum.worker.usdt
       ENV_FLU_ETHEREUM_WORK_QUEUE: worker.arbitrum.server.work.usdt

@@ -18,7 +18,7 @@ SERVICES:
       SERVICE_NAME: microservice-arbitrum-worker-server-usdc
       ENV_FLU_WORKER_ID: arbitrum-microservice-arbitrum-worker-server-usdc
       ENV_FLU_ETHEREUM_CONTRACT_ADDR: "0x4cfa50b7ce747e2d61724fcac57f24b748ff2b2a"
-      ENV_FLU_ETHERUEM_UTILITY_TOKEN_DETAILS: "FLUID:USDC:6,chronos initial boost:USDC:6"
+      ENV_FLU_ETHERUEM_UTILITY_TOKEN_DETAILS: "FLUID:USDC:6,wombat initial boost:WOM:18,chronos initial boost:USDC:6"
       ENV_FLU_ETHEREUM_AMQP_QUEUE_NAME: arbitrum.worker.usdc
       ENV_FLU_ETHEREUM_WORK_QUEUE: worker.arbitrum.server.work.usdc

@@ -26,6 +26,6 @@ SERVICES:
       SERVICE_NAME: microservice-arbitrum-worker-server-dai
       ENV_FLU_WORKER_ID: arbitrum-microservice-arbitrum-worker-server-dai
       ENV_FLU_ETHEREUM_CONTRACT_ADDR: "0x1b40e7812e75d02eef97e4399c33865d2ff5952b"
-      ENV_FLU_ETHERUEM_UTILITY_TOKEN_DETAILS: "FLUID:DAI:18,chronos initial boost:USDC:6"
+      ENV_FLU_ETHERUEM_UTILITY_TOKEN_DETAILS: "FLUID:DAI:18,wombat initial boost:WOM:18,chronos initial boost:USDC:6"
       ENV_FLU_ETHEREUM_AMQP_QUEUE_NAME: arbitrum.worker.dai
       ENV_FLU_ETHEREUM_WORK_QUEUE: worker.arbitrum.server.work.dai
diff --git a/automation/arbitrum/worker-spooler/mainnet.yml b/automation/arbitrum/worker-spooler/mainnet.yml
--- a/automation/arbitrum/worker-spooler/mainnet.yml
+++ b/automation/arbitrum/worker-spooler/mainnet.yml
@@ -11,18 +11,18 @@ SERVICES:
     ENV_FLU_WORKER_ID: arbitrum-microservice-arbitrum-worker-spooler-usdc
     ENV_FLU_ETHEREUM_WINNERS_AMQP_QUEUE_NAME: arbitrum.winners.usdc
     ENV_FLU_ETHEREUM_BATCHED_WINNERS_AMQP_QUEUE_NAME: arbitrum.winners.batched.usdc
-    ENV_FLU_ETHERUEM_UTILITY_TOKEN_DETAILS: "FLUID:USDC:6,chronos initial boost:USDC:6"
+    ENV_FLU_ETHERUEM_UTILITY_TOKEN_DETAILS: "FLUID:USDC:6,wombat initial boost:WOM:18,chronos initial boost:USDC:6"

  - SPOOLER_USDT:
     SERVICE_NAME: microservice-arbitrum-worker-spooler-usdt
     ENV_FLU_WORKER_ID: arbitrum-microservice-arbitrum-worker-spooler-usdt
     ENV_FLU_ETHEREUM_WINNERS_AMQP_QUEUE_NAME: arbitrum.winners.usdt
     ENV_FLU_ETHEREUM_BATCHED_WINNERS_AMQP_QUEUE_NAME: arbitrum.winners.batched.usdt
-    ENV_FLU_ETHERUEM_UTILITY_TOKEN_DETAILS: "FLUID:USDT:6,chronos initial boost:USDC:6"
+    ENV_FLU_ETHERUEM_UTILITY_TOKEN_DETAILS: "FLUID:USDT:6,wombat initial boost:WOM:18,chronos initial boost:USDC:6"

  - SPOOLER_DAI:
     SERVICE_NAME: microservice-arbitrum-worker-spooler-dai
     ENV_FLU_WORKER_ID: arbitrum-microservice-arbitrum-worker-spooler-dai
     ENV_FLU_ETHEREUM_WINNERS_AMQP_QUEUE_NAME: arbitrum.winners.dai
     ENV_FLU_ETHEREUM_BATCHED_WINNERS_AMQP_QUEUE_NAME: arbitrum.winners.batched.dai
-    ENV_FLU_ETHERUEM_UTILITY_TOKEN_DETAILS: "FLUID:DAI:18,chronos initial boost:USDC:6"
+    ENV_FLU_ETHERUEM_UTILITY_TOKEN_DETAILS: "FLUID:DAI:18,wombat initial boost:WOM:18,chronos initial boost:USDC:6"

```

4. Set up an instance of `microservice-ethereum-track-winners` in `automation/<network>/track-winners/mainnet.yml`, using the following template:

```yaml
  - TRACK_WINNERS_<TOKEN>:
      SERVICE_NAME: microservice-<network>-track-winners-<token>
      ENV_FLU_WORKER_ID: <network>-microservice-<network>-track-winners-<token>
      ENV_FLU_ETHEREUM_CONTRACT_ADDR: "contract address of the underlying token"
      ENV_FLU_ETHEREUM_UNDERLYING_TOKEN_NAME: TOKEN_NAME
      ENV_FLU_ETHEREUM_UNDERLYING_TOKEN_DECIMALS: 6
```
