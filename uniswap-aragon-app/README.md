# Uniswap Aragon App

Uniswap app including an Agent instance, which is callable through this app's contract. 

The Agent is useful for integrating with external Ethereum protocols that require the sender of a transaction be the owner of assets related to that transaction. Eg they will often use `msg.sender` to identify the asset owner in a transaction. Typical Aragon apps would allow for interaction with these protocols although they couldn't create signed messages, execute arbitrary functions if necessary or store funds in a vault unless built in separately.

Includes basic tabbed UI layout with settings tab for changing the Agent address.
