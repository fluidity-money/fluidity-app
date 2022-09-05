# 👷 Worker architecture

### Very high level story

The two currently supported platforms (Ethereum and Solana) follow a similar story:

1. Worker server becomes aware of a block/slot containing a Fluid Asset interaction
2. Worker server sends the block/slot to an Application server if it believes an application is contained within (ie, a swap on Uniswap, Saber use)
3. Application server decodes the interaction and sends a decorated structure to the Worker server's queue for processing (next time)
4. Worker server computes the current state of the TRF using every available variable (fees paid for each application used, past state history, averages if there are any) and sends it to the Worker client queue
5. Worker client optionally computes more variables after fetching data (this system is disintermediated since some upstream dependencies are unreliable and can dilute the calculation in the previous stage)
6. Worker client either sends the transaction depending on the backend (Solana) or sends it to the final stage which aggregates the batched payouts (Ethereum)

### Ethereum architecture up close



