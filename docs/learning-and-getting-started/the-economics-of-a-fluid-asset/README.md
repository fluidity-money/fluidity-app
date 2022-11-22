---
description: >-
  How does Fluidity protect itself from sybil attacks? How is the probability of
  payouts and the associated sizes calculated?
---

# 🗃 The Economics of a Fluid Asset

### How Fluidity protects against attackers

{% hint style="info" %}
#### **Optimistic Solution**

The Optimistic Solution is Fluidity’s answer to preventing spam attacks on the protocol by using gas fees as a protection mechanism, ensuring that attackers will always spend more in fees than they would receive in rewards. It works by calculating the expected value for every user and including that variable in the Transfer Reward Function.
{% endhint %}

At this point you may be wondering, if Fluid Assets, pay yield when you use them, how does the protocol protect against bots sending money back and forth or 'sybil attacks'?

Fluidity essentially uses what we call an "Optimistic Solution" where we make a trivial assumption:

_"Imagine if the gas fee or platform fee when using the Fluid Asset for example (fUSDC) was more than the yield that one could extract from the protocol?"_

Sending or using a Fluid Asset costs a small gas fee or platform fee such as (LP fees or Trading fees). These are network or platform fees, that you would have to pay regardless of using a Fluid Asset or not, hence we utilise them as protection, as we do not charge any extra fees.

**For example:**

> Imagine an attacker sending Fluid USDC (ƒUSDC) back and forth 1000 times, costs $5,000 in gas fees. ($5/tx). If the yield the attacker earnt was less than $5,000, for example $2,500. The attacker will go bankrupt over time. We call this the **Optimistic Solution**.

### How often and how large are the rewards?

{% hint style="info" %}
#### Transfer Reward Function (TRF)

Fluidity’s payout mechanism is determined by the Transfer Reward Function (TRF for short). In its base form, it includes the Optimistic Solution to prevent spam attacks and ensures that the protocol pays out all of the gathered yields from the underlying assets. The drawing mechanism for picking “winners” is similar to that of a 'lottery", with a pool of “balls” to draw from for a single transaction.
{% endhint %}

To be able to calculate how often and large the rewards are, we need a few pieces of information. \*\*\*\* Including:

1. The size of the reward pool (**Ξ**)
2. The annual number of fluid txs as moving average (ATX)
3. The gas fee or fee paid to do a transaction (g)
4. The number of reward tiers (m)

{% hint style="info" %}
This information is required to be able to ensure that we can protect the protocol from attackers and that the protocol is not overtime paying out more in rewards than it is able to generate in yield\*\*.\*\*
{% endhint %}

We can input this information in the TRF to generate the associated payouts. We recompute the payouts every block to account for changes in **Ξ**, ATX and g. The size and frequency of payouts change every block based on how these variables change.

**In the next section, we will explore an example.**

{% content-ref url="transfer-reward-function-trf-example.md" %}
[transfer-reward-function-trf-example.md](transfer-reward-function-trf-example.md)
{% endcontent-ref %}

### Elastic Sigmoid Curve

The Elastic Sigmoid Curve (ESC) is designed to incentivise and reward good behaviour in the protocol through higher expected outcomes over time. It depends on the holdings of both sender and receiver to ensure larger payouts for providing liquidity and participating in the governance of the DAO. You can learn more [here](https://fluidity.wispform.com/feb5f260).
