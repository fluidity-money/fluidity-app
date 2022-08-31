# 🌊 Other Use Cases

There may be use cases that may not be evident on how Fluidity may be utilised in conjunction with, we can allow developers to define custom triggers and behaviours that would allow their systems to be compatible with Fluidity. _**Superfluid**_ would be one such example:

{% hint style="info" %}
Currently, this is purely an example.
{% endhint %}

### Superfluid:

* Payment stream&#x20;
* Custom API/Tools/Interfaces in tandem with Fluidity.

A superfluid can actually define the trigger event for payouts. For instance: superfluid focuses on streaming payments which makes it non-trivial to decide when to trigger a potential payout, we can allow the Super Fluid team to define this such asL

* The trigger of payout is when the funds are withdrawn. (ie. the stream is complete).&#x20;
* We call the trigger mechanism for the payout when x % of the stream is done.

Even though the way they work is quite different from Fluidity, we can make them work together through these custom-defined triggers.

We can allow developers to define the trigger points and the rules to how fluidity would work with their use case, within the context of their system. Such as in games or other platforms like b2b applications or storage use cases.

They have the tools to create the payment mechanism whenever they want but we are not fundamentally changing the way our system behaves, hence putting them in control of when a payout occurs.

