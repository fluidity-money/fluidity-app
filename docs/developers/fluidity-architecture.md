# 🏢 High level architecture

Fluidity is a mostly off-chain system that:

* Determines winners according to the TRF with all data available
* Aggregates transfers made
* Calculates future probabilities of winning with regards to past data
* Decodes interactions with protocols and applications for fee structure reasons
* Receives its constraints using on-chain DAO (:wink:)

Events produced on-chain are aggregated into winners below a threshold while rewarding massive winners instantly. A redemption feature is built into the webapp that lets users instantly redeem small prizes.

{% content-ref url="fluidity-architecture/worker-architecture.md" %}
[worker-architecture.md](fluidity-architecture/worker-architecture.md)
{% endcontent-ref %}

{% content-ref url="fluidity-architecture/ethereum-contract-architecture.md" %}
[ethereum-contract-architecture.md](fluidity-architecture/ethereum-contract-architecture.md)
{% endcontent-ref %}

{% content-ref url="fluidity-architecture/solana-program-architecture.md" %}
[solana-program-architecture.md](fluidity-architecture/solana-program-architecture.md)
{% endcontent-ref %}
