---
description: Frequently asked questions about the security of Fluidity and its mechanisms.
cover: https://fluidity.money/gitbook-content/background-2.png
coverY: 0
---

# 📄 FAQ

### Do I need to integrate or use special wallets to use Fluidity?

Fluid Assets are a regular token to the corresponding blockchain, (erc-20, sol). as long as Fluid Assets are supported on your chain of choice and your protocol or application supports regular tokens then you are able to participate in the Fluid Economy.

### **Do I own my Fluid assets? Is there a risk of me losing my base asset?**

You have total ownership of your Fluid Assets. A Fluid asset is essentially a wrapped token whose value is tied to that of the underlying base cryptocurrency.

There is no risk of losing the base asset as Fluid Assets are a 1:1 pegged to their base asset counterparts and can be redeemed fully at any time.

### **How are rewards distributed?**

When you use a Fluid Asset, your balance may increase. This means you have received a reward. The number of rewards you win changes based on several variables. You do not have to claim them, they will be airdropped to the wallets that originated and received the Fluid Assets.

See : [#how-often-and-how-large-are-the-rewards](../learning-and-getting-started/the-economics-of-a-fluid-asset/#how-often-and-how-large-are-the-rewards "mention")

Rewards are distributed in an 80-20 manner. The sending party receives 80% of the reward and the receiving party receives 20% of the reward.

### **1:1 exchange rate?**

Fluidity assets are pegged to the collateral and Fluidity does not hold custody of your tokens, they are escrowed on the smart contract.

You are free from market volatility risk when exchanging your fluid assets to the base asset you have deposited at any point in time through our web application, and if it is down, through the method call on the corresponding swap smart contract.

### **How do I know Fluidity is fair?**

We currently have a 3 step process in order to secure the fairness of using Fluidity.

{% hint style="info" %}
We are currently unable to utilise existing solutions such as VRF, as we need randomness on every single transaction and the current methods are economically unfeasible if we are to consider the transaction costs and the pertaining reward following said transaction. We do not want to cast this cost on the user.
{% endhint %}

1. **Internal**
   * We are currently in the internal phase where we utilise existing services that are sufficiently trustworthy such as [random.org](https://www.random.org/) in order to facilitate the randomness of every single transaction. This allows for high performance as we initially build our system and maintains the current **zero participation cost** when interacting and receiving rewards from Fluid Assets.
2. **Node-based**
3. **Completely Decentralised**

It is worth noting that you are able to exchange your base principal asset at any time between its wrapped fluid version and vice versa, so your exposure for your fluid assets is always completely decentralised.

### Where can I use a Fluid Asset? What are some use cases?

You can use Fluid Assets in any supported Blochckain and Protocol.

There are a variety of use-cases where Fluid Assets may be used, some of which include:

* Sending, receiving, and swapping tokens
* Minting, trading, and selling NFTs
* Blockchain-based gaming
* Performing transactions in a DEX

Anything that requires a transaction of value to be made can be enhanced through the interaction within the Fluidity ecosystem. You can have a more detailed read on Fluidity utility and use-cases below:

{% content-ref url="broken-reference/" %}
[broken-reference](broken-reference/)
{% endcontent-ref %}
