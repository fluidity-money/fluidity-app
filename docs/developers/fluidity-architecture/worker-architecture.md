# 👷 Worker architecture

The two currently supported platforms (Ethereum and Solana) follow a similar process:

1. Application server becomes aware of a block/slot
2. Application server classifies Fluid Asset interactions in the block/slot as either&#x20;
   * a standard Fluid Asset transfer
   * an application transaction utilising a Fluid Asset (e.g. a swap on Uniswap, Saber use)
3. For application transactions, the Application server decodes the interaction and attaches a decorated structure containing information such as its associated fees&#x20;
4. Application server sends all Fluid Asset interactions to the Worker Server
5. Worker computes the current state of the TRF using every available variable (fees paid for each application used, past state history, averages if there are any) and sends it to the Worker client queue
6. Worker optionally computes more variables after fetching data (this system is disintermediated since some upstream dependencies are unreliable and can dilute the calculation in the previous stage)
7. Worker either sends the transaction depending on the backend (Solana) or sends it to the final stage which aggregates the batched payouts (Ethereum)

