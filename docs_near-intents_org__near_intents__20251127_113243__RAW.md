# Documentation


## Table of Contents


- [Overview](#overview)

- [Treasury Addresses](#treasury-addresses)

- [Examples](#examples)

- [Fees](#fees)

- [Risk and Compliance](#risk-and-compliance)

- [Chain Support](#chain-support)

- [Market Makers](#market-makers)

- [FAQs](#faqs)

- [Distribution Channels](#distribution-channels)

- [Security](#security)

- [Verifier](#verifier)

- [Message Bus](#message-bus)

- [Introduction](#introduction)

- [Deposits and withdrawals](#deposits-and-withdrawals)

- [Signing Intents](#signing-intents)

- [Passive Deposit/Withdrawal Service](#passive-deposit/withdrawal-service)

- [Intent types and execution](#intent-types-and-execution)

- [Events](#events)

- [Account Abstraction](#account-abstraction)

- [Example Transactions](#example-transactions)

- [Simulating intents](#simulating-intents)


---


## Overview


Edit
Overview
NEAR Intents is a new multichain transaction protocol where users specify desired outcomes and let third parties compete to provide the best solution.
NEAR Intents and its documentation are under active development and have recently been renamed from "Defuse" to "NEAR Intents".
While the documentation and examples here focus on multichain token swaps, NEAR Intents extend far beyond these types of requests. Whether you want to swap tokens across chains or buy a pizza with Bitcoin, NEAR Intents serves as a protocol for ANY request where diverse solution marketplaces can naturally emerge through competitive discovery.
Read more about it in this
NEAR Intents Deep Dive blogpost
.
NEAR Intents Components
There are three core components of NEAR Intents:
Name
Description
Distribution Channels
Applications used for creating, broadcasting, and executing user Intents. (ex. Apps, Wallets, Exchanges)
Market Makers
Users or Agents that provide liquidity and compete to fulfill "Intent Requests".
Verifier Smart Contract
A smart contract deployed on NEAR Protocol that verifies and settles all transactions.
Next
Distribution Channels
Last updated
5 months ago


## Treasury Addresses


Edit
Treasury Addresses
Treasury Addresses
For transparency and AML compliance, below are the treasury and refill addresses used by
NEAR Intents
and
HOT Bridge
, listed by network.
Network
NEAR Intents Treasury Address
HOT Bridge Treasury Address
EVM Chains (Ethereum, Arbitrum, Aurora, Base, Bera, BNB, Gnosis, Polygon, Optimism, XLayer, Monad)
0x2CfF890f0378a11913B6129B2E97417a2c302680
0x233c5370CCfb3cD7409d9A3fb98ab94dE94Cb4Cd
Bitcoin (BTC)
1C6XJtNXiuXvk4oUAVMkKF57CRpaTrN5Ra
–
Solana (SOL)
HWjmoUNYckccg9Qrwi43JTzBcGcM1nbdAtATf9GXmz16
8sXzdKW2jFj7V5heRwPMcygzNH3JZnmie5ZRuNoTuKQC
Dogecoin (DOGE)
DRmCnxzL9U11EJzLmWkm2ikaZikPFbLuQD
–
XRP (XRP Ledger)
r9R8jciZBYGq32DxxQrBPi5ysZm67iQitH
–
Monad (MON)
0x233c5370ccfb3cd7409d9a3fb98ab94de94cb4cd
–
XLayer (LRX)
0x233c5370ccfb3cd7409d9a3fb98ab94de94cb4cd
–
Litecoin (LTC)
LQjEMkuiA2pCwFeUPwsu6ktzUubBVLsahX
–
Zcash (ZEC)
t1Ku2KLyndDPsR32jwnrTMd3yvi9tfFP8ML
–
TRON (TRX)
TX5XiRXdyz7sdFwF5mnhT1QoGCpbkncpke
–
NEAR (NEAR)
intents.near
–
TON
UQAfoBd_f0pIvNpUPAkOguUrFWpGWV9TWBeZs_5TXE95_trZ
EQANEViM3AKQzi6Aj3sEeyqFu8pXqhy9Q9xGoId_0qp3CNVJ
Stellar (XLM)
GDJ4JZXZELZD737NVFORH4PSSQDWFDZTKW3AIDKHYQG23ZXBPDGGQBJK
CCLWL5NYSV2WJQ3VBU44AMDHEVKEPA45N2QP2LL62O3JVKPGWWAQUVAG
Sui (SUI)
0x00ea18889868519abd2f238966cab9875750bb2859ed3a34debec37781520138
–
Aptos (APT)
0xd1a1c1804e91ba85a569c7f018bb7502d2f13d4742d2611953c9c14681af6446
–
Cardano (ADA)
addr1v8wfpcg4qfhmnzprzysj6j9c53u5j56j8rvhyjp08s53s6g07rfjm
–
Refill Addresses
Network
Refill Address
EVM Chains (Ethereum, Arbitrum, Aurora, Base, Bera, BNB, Gnosis, Polygon, Optimism, XLayer, Monad)
0xbb2f33f73ccc2c74e3fb9bb8eb75241ac15337e0
Cardano
addr1v92k8ex6m7yykq6j0psqlrxxeq23220g9x8yeqd4g65qq3shttpln
TRON
TNzQzT8wDF1GVevMqehVDY51ucxxrNfCap
Solana
9WL2A89YBr6X47ABKYNzPentWiBA3H8tpaiuf5CaYHx6
TON
EQDgTfO4pJ8LxznVfC0mHsGl94bQBU4KFcJfliAIHebQU2G4
SUI
0x1f6cd55584e6d0c19ae34bfc48b1bd9b1b8a166987e34052cfea7f3c795c6d76
Aptos
0x107b277f8ac97230f1e53cf3661b3f05a40c5a02d1d2b74fe77826b62b4d1c43
Litecoin
LVUMGpKvAzC4C8KprqyUDWpk6oPd4rKFV9
Previous
Chain Support
Next
Fees
Last updated
14 hours ago


## Examples


Edit
Examples
Examples of different implementations
Below are various references for NEAR Intents protocol:
Link
Description
Type
Defuse Frontend
near-intents.org
GitHub
Cross-Chain Swap Examples
Tutorial for cross-chain token swaps using 1-Click API
GitHub
AMM Solver
Sample market maker with AMM functionality
GitHub
Python Client
A Python example of interacting with the Message Bus
GitHub
Intent JSON Validator
Tool to verify signed intent JSON correctness
GitHub
TEE Solver Registry
Secure TEE-based solver and liquidity protocol
GitHub
Near Intents 101
A New Way to Transact - Build Smarter with AI & Blockchain
Video
Near Intents 102
Build Your First One-Click API App for Cross-Chain Swaps
Video
Agent Example
Python tool for AI-driven NEAR swaps
GitHub
Previous
Fees
Last updated
15 days ago


## Fees


Edit
Fees
This page describes all fees that apply to NEAR Intents transactions and integrations.
Protocol Fee
0.0001% (1 pip)
per transaction.
Collected on-chain by the
intents.near
smart contract.
Applies to every transfer, swap, or transaction.
These fees are sent to the
fee_collector
.
Near-Intents.org Fee
0.2%
fee on swaps executed through
near-intents.org
.
Collected by the proprietary distribution channel in addition to the protocol fee.
These fees are sent to
fefundsadmin.sputnik-dao.near
.
1Click Swap API Fees
1Click Swap API (with API key):
Only the 0.0001% protocol fee applies.
1Click Swap API (without API key):
An additional
0.1%
fee is charged. Apply for the API Key
here
.
Developers/Distribution Channels can also add their own fees on top using the
appFees
parameter.
Previous
Treasury Addresses
Next
Examples
Last updated
1 month ago


## Risk and Compliance


Edit
Risk and Compliance
Introduction
At NEAR Intents, we are deeply committed to implementing best practices in compliance and financial integrity. Transparency, accountability, and adherence to international standards are not just regulatory requirements for us — they are guiding principles. Our goal is to ensure that all transactions routed through NEAR Intents are secure, transparent, and fully aligned with global efforts to combat money laundering, sanctions violations, and other forms of financial crime.
Current Implementation
1. Real-time compliance screening for 1Click Swap API quote requests
Every quote request undergoes automated compliance checks against multiple trusted data sources:
NEAR Intents AML Portal
- (
aml.near-intents.org
)
Binance AML
AMLBot
PureFI
These checks are designed to identify any overlap between addresses provided in the request and addresses flagged in external databases.
2. Enhanced screening for 1Click Swap API non-dry quote requests
In addition to the above, all non-dry quote requests are screened against
TRM Labs
datasets. At present, we automatically block quote issuance for any address that TRM Labs flags with:
Sanctions (with
riskType: OWNERSHIP
)
Blocking behavior
When a match is detected, the quote request is immediately rejected, and the corresponding user or distribution channel receives a clear response that the quote has been blocked. This ensures that potentially tainted flows are contained at the very first interaction point.
Previous
Security
Next
Chain Support
Last updated
6 days ago


## Chain Support


Edit
Chain Support
List of supported chains and their respective address types can be seen in the table below:
Chain
Address Types
Support Status
Example Address
EVM Chains (Arbitrum, Aurora, Base, Bera, BNB, Ethereum, Gnosis, Polygon, XLayer, Monad)
- EVM address (
0x
-prefixed, 42-char hex)
✅ Supported
0x85F17Cf997934a597031b2E18a9aB6ebD4B9f6a4
Cardano
- Shelley Base
- Enterprise
⚠️ Partially supported
addr1v8wfpcg4qfhmnzprzysj6j9c53u5j56j8rvhyjp08s53s6g07rfjm
Bitcoin
- Legacy (
1
prefix)
- P2SH (
3
prefix)
- Bech32 (
bc1
)
- Taproot (
bc1p
)
✅ Supported
1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
(Legacy)
3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5
(P2SH)
bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kygt080
(Bech32)
bc1p5cyxnuxmeuwuvkwfem96llyr29s8l68p7z6zgt7zdkv3g7zv3qvqz6z8h7
(Taproot)
Doge
- P2PKH/Legacy (starts with
D
)
- P2SH (starts with
A
or
9
)
✅ Supported
D9nssC5jR1viPZhWwFvDkjYpJZYJVydN8k
Litecoin
- Legacy (
L
prefix)
- P2SH (
M
prefix)
- Bech32 (
ltc1q
)
- Taproot (
ltc1p
)
✅ Supported
LZ3v1o8qK4b7sJ9mH2f5xQp8Pd1cR6TuVa
(Legacy)
MDf8y1Kq9Tm5sR3aP7uW4cXn2Lb6vZjQhE
(P2SH)
ltc1q9k3p7u5n0s4y8v2h3w6j5c9r2t0m4k7f5p0d2
(Bech32)
ltc1p4h7q9m3x5u2n8k6t4v9y3r5c2w7z0l3p5u8y6f0k2d
(Taproot)
NEAR
- Named (
something.near
)
- Implicit (64-char hex, SHA-256 of pubkey)
✅ Supported
alice.near
,
ed25519:...
Sui
- Sui Address (32-char hex)
✅ Supported
0xcc64b79a3adf4d3c21ad25a97e3ecbe83e659e68964f62e6a1da8a037346a4ce
Stellar
- 56-character base32 string
✅ Supported
GBD7QFQVR4QWNEJSHP4VN7RAAUKXTMZ4EJ4EBMCR7CP3HMF7RXEASTD7
Solana
- Base58-encoded Ed25519 public key (typically 44 chars)
✅ Supported
BYPsjxa3YuZESQz1dKuBw1QSFCSpecsm8nCQhY5xbU1Z
TON
- TON Addresses
✅ Supported
EQAWzEKcdnykvXfUNouqdS62tvrp32bCxuKS6eQrS6ISgcLo
Tron
- Base58Check-encoded (starts with
T
)
✅ Supported
TQ1shhBFTN2TwaRXyH1oLyCz3Yvfbzgmbk
XRP
- Classic (starts with
r
)
- Classic + Tag
- X-Address (starts with
X
)
✅ Supported
rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv
ZCash
- Transparent (
t1
,
t3
)
- Unified (
u1
)
⚠️ Partially supported
t1ZCashExample...
,
t3ZCashExample...
,
u1ZCashExample...
This table provides an overview of supported signature standards and corresponding wallet types. For technical details on how intent signing works, see
Signing Intents
.
Signing Standard
Supported Wallets / Apps
Implementation Status
NEP‑413
NEAR wallets: MyNearWallet, Meteor, Sender, Ledger‑NEAR
✅ Implemented
ERC‑191
All EVM wallets: MetaMask, Rabby, Rainbow, WalletConnect‑compatible
✅ Implemented
Raw Ed25519
Solana wallets: Phantom, Solflare, Slope
✅ Implemented
Passkeys (WebAuthn)
Browsers/OS platforms: Chrome, Safari, Edge, Firefox, native apps
✅ Implemented
SEP‑53
Stellar wallets: Freighter, Lumens Wallet, SatoshiPay
✅ Implemented
TIP‑191
TRON wallets: TronLink, Klever, Trust Wallet
✅ Implemented
TON Connect
TON wallets: Tonkeeper, EverWallet, HOT Wallet and other TonConnect 2.0 wallets
✅ Implemented
BIP‑322
Bitcoin wallets: Sparrow, Bitcoin Knots, Bitcoin Core
⚙️ In progress
Previous
Risk and Compliance
Next
Treasury Addresses
Last updated
1 day ago


## Market Makers


Edit
Market Makers
How to integrate NEAR intents as a market maker
Market Makers are active market participants that deposit liquidity in order to fill quotes issued by users.
To start market making, you are required to perform
bridging
and
quoting
.
Passive Deposit/Withdrawal Service
In order to deposit and withdraw liquidity, market makers need to send funds themselves or do it via one of the distribution channels (e.g.
https://near-intents.org
) .
To send the liquidity, please get familiar with
Passive Deposit/Withdrawal Service
for deposits and with specific bridge (PoA, Omni or HOT) API for withdrawals. More information on that and an SDK will be available soon.
Quoting
Once the liquidity is available for trading, use the
Message Bus API
to receive and sign quotes.
Previous
Intents Explorer API
Next
Message Bus
Last updated
4 months ago


## FAQs


Edit
FAQs
Frequently Asked Questions
Is there a testnet deployment?
There is no testnet deployment and no plans for one. We recommend testing on NEAR mainnet using separate dev/test NEAR accounts.
Is there support for native NEAR deposits?
Only
ft_transfer_call
can be used to deposit NEP-141 tokens from Near to
intents.near
:\
<TOKEN_ACCOUNT_ID>::ft_transfer_call({
"receiver_id": "intents.near",
"amount": "1234",
"msg": "{\"receiver_id\": \"<ACCOUNT_ID>\"}"
})
Here is an example
receipt
for that.
Parameter
msg
can also be empty, so that funds will be deposited to
sender_id
(i.e. caller of
ft_transfer_call
). Here is an example of such
tx
tx_hash
in the
recent_deposit
response for all SOL deposits is empty
This information is not available for Solana because the mechanism of deposit tracking works a bit differently there.
Is there a reason why my UTXOs aren't being swept on the BTC ? I sent 5,000 sats
This is a very small amount that is considered to be "dust" and there is a special business logic to process such small amount.
How does the deposit process work?
The deposit process begins once the transfer transaction on the foreign network has been completed. When the balance of the user's unique deposit address has become positive our indexer generates a deposit event and assigns it a PENDING status.
The next step is collecting the current tokens in storage. The result of this process will be either a COMPLETED or FAILED status. Deposits with a FAILED status are currently handled manually and eventually updated to the COMPLETED status.
On EVM networks, deposits can bypass the PENDING status due to the faster processing and transfer completion times.
The data structure for the PENDING and FAILED statuses is identical to that of the COMPLETED status.
Regarding BTC deposits: If you want to make a deposit to an account that hasn’t yet been connected to the application - this is possible but requires extreme caution. You can request a deposit address by calling the bridge API (deposit_address) and specifying the account_id parameter. The account_id can be a NEAR account, an EVM address, or a SOL address to which you have access.
It is recommended starting with a small amount for experimentation. After the deposit is completed, you can connect wallet and check the tokens.
ETH-connector migration
Because of the split of ETH-connector,
aurora
contract now
acts
as a NEP-141 proxy to
eth.bridge.near
. This leads to some changes:
Firstly,
ALL
new deposits will be
treated
as
eth.bridge.near
, even if triggered from
aurora
smart-contract. Even from inside of Aurora Mainnet (example
tx
)! ALL withdrawals of legacy
aurora
will be received on Near as new
eth.bridge.near
.
Secondly, the migration of already deposited Eth@Near (
aurora
) can be done
permissionlessly
by withdrawing from
intents.near
and depositing it back right away. Luckily, it's possible to do that in a single tx thanks to
this
patch on eth-connector side.
Users can migrate in two ways:
Via
ft_withdraw()
tx
with following params:
{
"token": "aurora", // legacy token
"receiver_id": "intents.near", // deposit back
"amount": "1234",
"memo": "Migrate ETH: aurora -> eth.bride.near",
"msg": "<USER_ACCOUNT_ID>", // recipient inside intents.near for eth.bridge.near tokens
}
Via
ft_withdraw
intent with the
same
params as in above ^
The
front-end
automatically detects legacy tokens on user's balance and prompts him to sign such migration intent.
Previous
Simulating intents
Next
Security
Last updated
4 months ago


## Distribution Channels


Edit
Distribution Channels
NEAR Intents Distribution Channels
What are Distribution Channels?
Distribution Channels are the user-facing applications, wallets, and exchanges that make NEAR Intents accessible to end users. They handle intent creation, management, and asset delivery, while
Market Makers
handle the actual fulfillment and pricing.
Create a Distribution Channel
The fastest way to integrate NEAR Intents into your application is through the
1Click Swap API
. This REST API abstracts away the complexity of intent creation, solver coordination, and transaction execution, letting you focus on your user experience.
Perfect for: Wallets, dApps, and exchanges wanting to offer intent-based transactions without building infrastructure from scratch.
Get started with 1Click API →
Previous
Overview
Next
1Click API
Last updated
5 months ago


## Security


Edit
Security
List of audits could be found in
Google Drive
.
Please report bugs and security vulnerabilities via
Hackenproof
bug bounty program.
For any AML/CTF (Anti-Money Laundering and Counter-Terrorism Financing) related requests, please refer to our
AML Portal
.
Previous
FAQs
Next
Risk and Compliance
Last updated
2 months ago


## Verifier


Edit
Verifier
Source code and deployment for the verifier smart contract
Deployment
The smart contract for NEAR Intents protocol is deployed at
intents.near
There is no testnet deployment.
Source code
Not found
Previous
Passive Deposit/Withdrawal Service
Next
Introduction
Last updated
7 months ago


## Message Bus


Edit
Message Bus
An off chain message bus used for communication between market makers and users and sending the settlement transactions to verifier contract.
Message Bus is an additional system component that optimizes the price discovery process. Any frontend app may use Message Bus or launch its own instance.
Message Bus
Near Intents protocol may operate without a Message Bus component:
frontends may use any other quoting mechanisms to compose and publish signed intents
market makers may index NEAR blockchain to find intents to fill.
Previous
Market Makers
Next
API
Last updated
4 months ago


## Introduction


Edit
Introduction
The Verifier contract is a smart contract on the Near blockchain that is used as the atomic mediator of transferring assets among users in the intents ecosystem. A brief explanation of the terms mentioned follows.
The
Verifier
section is written for those who would like to interact with the
Verifier
smart contract directly, or would like to create payloads for the
Message Bus
. After all, the Message Bus acts as a matching system that brings together quotes from market makers with requests for transactions.
Note: The former name of the smart contract is "Defuse". It is still the name used for the smart contract at the time of writing this documentation in a few places. It is planned to change this in the future.
What payload are we referring to, or what is the workflow?
Let's start with the assumption that any participant in the
Verifier
smart contract has the tokens in question
deposited
into the smart contract.
In the intents protocol, a single user, be it a market maker, end-user or otherwise, expresses their "intent" to do a transaction. The transaction can be to transfer coins within the smart contract against receive other coins, transfer to another user, etc. These intents can be submitted directly to the smart contract, or can be bundled together by a 3rd party, like the Message Bus, to have them all executed atomically.
Let's discuss a few use-cases of the
Verifier
smart contract.
Example 1: Simple transfer
Alice, the owner of
alice.near
, wants to transfer a fungible token from their own account to the user
bob.near
. In this case, Alice creates an Intent object of type
Transfer
, expressing the desired destination,
bob.near
,
signs it
, and calls the function
execute_intents
in the Verifier smart contract. This will transfer ownership of the tokens in question from
alice.near
to
bob.near
.
Example 2: Token swap
Alice and Bob, agree to swap their
USDT
and
USDC
, 1000
USDT
from Alice for 1000
USDC
from Bob. It can be through chat, or a 3rd party tool, like the Message Bus. However, it is obvious that such a transaction requires trust if done without a impartial mediator. Alice could receive the
USDC
from Bob, and never send him the
USDT
she promised.
A solution to this problem goes as follows using the
Verifier
smart contract:
Alice and Bob deposit their
USDT
and
USDC
to the
Verifier
smart contract. The
Verifier
maintains full ownership of these assets to their depositors, giving them the freedom to withdraw them in case of any party backing out.
Alice creates and signs an intent of type
TokenDiff
, expressing that she is willing to lose 1000
USDT
if anyone would provide 1000
USDC
in return.
Bob creates and signs an intent of type
TokenDiff
, expressing that he is willing to lose 1000
USDC
if anyone would provide 1000
USDT
in return.
Both intents from Alice and Bob are bundled in a list. Alice or Bob can then call the function
execute_intents
in the
Verifier
smart contract. The smart contract will fulfill the swap, since both Intents are achievable within that transaction.
Alice now has 1000
USDC
in her account in the
Verifier
contract, and Bob has 1000
USDT
in his account.
Alice and Bob have the right to withdraw their
USDC/USDT
and allocate the funds according to their preferences.
Notice that this example is how peer to peer trading is achieved using Near Intents. After all, all that is needed to be able to trade is to have a mediator that bundles swap requests, i.e.,
TokenDiff
intents. This is what the Message Bus typically does. In fact, any 3rd party can do this.
Example 3: Withdrawal
From the previous example, if Alice wants to withdraw her USDC tokens, she creates and
signs
an Intent of type
FtWithdraw
, where she specifies the receiving address and the amount she wants to withdraw. She, then, calls the function
execute_intents
, and the
Verifier
smart contract will verify her ownership of the USDC tokens, and send them to the address she specified.
Withdrawals can also be done by directly calling the
Verifier
smart contract. More information in the
Deposits and withdrawals
Previous
Verifier
Next
Deposits and withdrawals
Last updated
6 months ago


## Deposits and withdrawals


Edit
Deposits and withdrawals
Depositing funds into the
Verifier
smart contract is the first step for using it. The Verifier smart contract is
open-source
, and has transparent logic to how it operates.
Previous
Introduction
Next
NEAR Token treatment
Last updated
6 months ago


## Signing Intents


Edit
Signing Intents
After creating intents, they must be signed before submission to the
Verifier
contract via the
execute_intents
function. This section explains the signing process.
Encoding Requirements for the Verifier Contract
Curve
Public Key
Signature
Ed25519
32 bytes
64 bytes
Secp256k1
64 bytes (uncompressed)
65 bytes (r || s || v)
P256
64 bytes (uncompressed)
64 bytes (r || s)
Important: Compressed public keys are not supported for ECDSA curves (Secp256k1, P256). Public keys must be in uncompressed format (raw 64-byte x || y coordinates without prefix bytes).
Signatures must be in raw concatenated byte format, not DER-encoded.
Account abstraction
As discussed in the
account abstraction section
, accounts in the
Verifier
contract are identified by their NEAR account (whether implicit, being derived from a public key, or named, like
alice.near
). Every account can add an arbitrary number of public keys. Every public key in a user's account can be used to produce signatures that authorize intents for that user. Proper key management is essential.
Signing philosophy and where our choice of algorithms come from
Digital signature algorithms vary significantly in design and application. Key differences include:
Key Generation:
The type of the public/private key generation mechanisms, like RSA vs elliptic curves
Curve types:
The type of curve within the elliptic curve, being a NIST curve, like secp256k1 from Bitcoin and Ethereum, or some Montgomery curve, like Ed25519
Message (payload) construction for verification:
Given a payload and a specific algorithm, how do we construct the message so that anyone can verify it with the public key?
Given that the goal with NEAR Intents, with any choice from the above, is to make it as easy as possible to integrate other wallets and services, we have allowed
multiple choices
on how to verify payloads. Each signature type corresponds to a wallet or service capable of verifying it.
For example, from the
available options
, you see ERC-191. This exists because Ethereum wallets, like Metamask, support the
ERC-191 standard
for off-chain data signing.
In the following subsections, we will discuss more available signature types.
Signature types
A signed
Transfer
intent that is ready to be submitted to the blockchain looks something like this:
{
"standard": "nep413",
"payload": {
"recipient": "intents.near",
"nonce": "Vij2xgAlKBKzgNPJFViEQRgYyS7p2NEiYTTY4XmT8go=",
"message": "{\"deadline\":\"2025-05-21T10:34:04.254392Z\",\"intents\":
[{\"intent\":\"transfer\",\"receiver_id\":\"bob.near\",\"tokens\":{\"nep141:usdc.near\":\"10\"}}],
\"signer_id\":\"alice.near\"}"
},
"public_key": "ed25519:C3jXhkGhEx88Gj7XKtUziJKXEBMRaJ67bWFkxJikVxZ2",
"signature": "ed25519:2ns3eCikZFxFA6e9ApunuDG4XwJUPrB8q82fYViBKjheqiDYcCmLN9RnB9NhoEvCdNoS3L3qYD9FAnKd7UkTnuij"
}
This object conforms to the
MultiPayload
enum. A signed intent can be one of the possibilities provided by this enum.
NEP-413
The object above follows the NEP-413
compliant standard
. This is an off-chain message signing standard that is recognized by NEAR wallets.
Encoding information
Nonce: base64
public_key: prefixed with the key type, then base58
signature: prefixed with the key type, then base58
ERC-191
The object of this type is compliant with the
ERC-191 standard
for off-chain message signing.
{
"standard": "erc191",
"payload": "{\"signer_id\":\"0xca67C1Bb3FD69857E5edaF6aA1c65371bF46A464\",\"verifying_contract\":\"intents.near\",\"deadline\":\"2025-05-26T13:24:16.983Z\",\"nonce\":\"Vij2xgAlKBKzwGNqwogWQxiy87p9jW5Omfg+L9bXBDw=\",\"intents\":[{\"intent\":\"token_diff\",\"diff\":{\"nep141:usdc.near\":\"-1000\",\"nep141:usdt.near\":\"1000\"}},{\"intent\":\"ft_withdraw\",\"token\":\"usdt.near\",\"receiver_id\":\"bob.near\",\"amount\":\"1000\"}]}",
"signature": "secp256k1:BoR53NKKJ2GfP8bETk427Xav8VMpUcZovLzXeq2EsUD7NnPH2sSmxWFEkDUrguJHHkiu3GwEQxxMo2Rm2ZTDHFygU"
}
Encoding information
signature: prefixed with the key type, then base58
Note that there is no public key, as the public key can be recovered from the signature and the data.
Raw Ed25519
This is a standard used by
Phantom wallet for Solana off-chain message signing
.
{
"standard": "raw_ed25519",
"payload": "{\"signer_id\":\"alice.near\",\"verifying_contract\":\"intents.near\",\"deadline\":{\"timestamp\":1732035219},\"nonce\":\"Vij2xgAlKBKzwGNqwogWQxi9ZuGDNBXlmdy9g3MQSMk=\",\"intents\":[{\"intent\":\"token_diff\",\"diff\":{\"nep141:usdc.near\":\"-1000\",\"nep141:usdt.near\":\"998\"}}]}",
"public_key": "ed25519:9aqyNsCRrDkq9SceVRCdW1Zs9BmEP8ieJQRJim8iRLF",
"signature": "ed25519:9RHRenkbYN6cfWXkou47sjAf1PuTc6nYM8amHADApfqio8dcMQu28cgfz6wkktBFoE8J7FsZ3rxifFdMdzTTJi6"
}
Encoding information
public_key: prefixed with the key type, then base58
signature: prefixed with the key type, then base58
Passkey, "WebAuthn"
This object type is meant to be used with
passkeys
with
Web Authentication standard
. An object of this type looks as follows:
{
"standard": "webauthn",
"payload": "{\"signer_id\":\"0x3602b546589a8fcafdce7fad64a46f91db0e4d50\",\"verifying_contract\":\"intents.near\",\"deadline\":\"2025-03-30T00:00:00Z\",\"nonce\":\"A3nsY1GMVjzyXL3mUzOOP3KT+5a0Ruy+QDNWPhchnxM=\",\"intents\":[{\"intent\":\"transfer\",\"receiver_id\":\"bob.near\",\"tokens\":{\"nep141:usdc.near\":\"1000\"}}]}",
"public_key": "p256:2V8Np9vGqLiwVZ8qmMmpkxU7CTRqje4WtwFeLimSwuuyF1rddQK5fELiMgxUnYbVjbZHCNnGc6fAe4JeDcVxgj3Q",
"signature": "p256:3KBMZ72BHUiVfE1ey5dpi3KgbXvSEf9kuxgBEax7qLBQtidZExxxjjQk1hTTGFRrPvUoEStfrjoFNVVW4Abar94W",
"client_data_json": "{\"type\":\"webauthn.get\",\"challenge\":\"4cveZsIe6p-WaEcL-Lhtzt3SZuXbYsjDdlFhLNrSjjk\",\"origin\":\"https://defuse-widget-git-feat-passkeys-defuse-94bbc1b2.vercel.app\"}",
"authenticator_data": "933cQogpBzE3RSAYSAkfWoNEcBd3X84PxE8iRrRVxMgdAAAAAA=="
}
The
signature
can use either
Ed25519 or P256, aka, secp256r1
.
Encoding information
The object uses the following encoding
authenticator_data: base64, url-safe
challenge: base64, url-safe
signature: prefixed with key type, being
p256
or
ed25519
, following by the signature in base58 encoding
public_key: prefixed with the key type, then base58
TonConnect
TonConnect follows the
standard for data signing
on TON.
{
"address": "EXvSRnDlYHziOJRm1MqGLgQB3EN7319eZLYWVinpoPv7LkBd",
"domain": "example.com",
"timestamp": "2025-01-01T00:00:00Z",
"payload": {
"type": "text",
"text": "{\"signer_id\":\"alice.near\",\"verifying_contract\":\"intent.near\",\"deadline\":\"2025-05-26T15:19:43.617898Z\",\"nonce\":\"ZnbiFf4tP4cn65XLuZ6T1H6/Vr3o6ucNftdx3pInLnc=\",\"intents\":[{\"intent\":\"ft_withdraw\",\"token\":\"usdc.near\",\"receiver_id\":\"bob.near\",\"amount\":\"1000\"}]}"
},
"public_key": "ed25519:G4HVCaJg9vZb2srcLoWxR9grQ3tGLNFMVrZBhTtBi4Q1",
"signature": "ed25519:5cwYdTNeGy1mApo9RNor9hSXvcG6GbvVm6di6kuf4frnARtVWRpJoPtvFKHMbt7uDGDtgFfn6bPDFGPK5jamqBwC"
}
Encoding information
public_key: prefixed with the key type, then base58
signature: prefixed with the key type, then base58
Adding more key and signature types
To support additional key or signature types, please contact the Near Intents team.
Previous
Intent types and execution
Next
Events
Last updated
7 days ago


## Passive Deposit/Withdrawal Service


Edit
Passive Deposit/Withdrawal Service
The Passive Deposit/Withdrawal Service enables seamless asset movement between
supported blockchain networks
and NEAR Intents. It provides a lightweight mechanism for moving tokens in and out of the protocol. This service only moves funds to/from the
treasury
on behalf of the user.
There is an SDK for integrating the Passive Deposits/Withdrawals Service:
Bridge SDK on GitHub
. This SDK is under active development and may introduce breaking changes.
How to use
Get supported assets
. The service only works with a specific list of tokens that are available for transfer to NEAR Intents. The list of supported tokens and networks can be obtained using this request.
Get deposit address.
Once you have verified that your token is supported by the service, you can use the request to obtain a deposit address. After receiving the address, transfer the tokens to it, and they will soon be available in NEAR Intents.
Get recent deposit.
The API service allows you to get the status of the most recent deposits. Simply send a request to retrieve this information.
Get withdrawal status
. The service supports token withdrawals from NEAR Intents to the supported network. To do this, call the 'withdrawal' contract method or use the frontend. The status of the withdrawal can be obtained upon request.
JSON-RPC Endpoint
POST:
https://bridge.chaindefuser.com/rpc
Requests
1. Get supported assets
Returns a list of tokens that are supported by the service in each network.
Parameters
[]chains
- chain filter.
Response
[].tokens.defuse_asset_identifier
— unique id of trading asset
[].tokens.near_token_id
— unique id of the token in the NEAR blockchain
[].tokens.decimals
— trading asset precision. should be used for amount setup during intent creation
[].tokens.asset_name
— trading asset name
[].tokens.min_deposit_amount
— minimum amount of tokens to trigger transfer process
[].tokens.min_withdrawal_amount
— minimum amount of tokens to initiate a withdrawal
[].tokens.withdrawal_fee
— the fee charged for withdrawing the specified token
Example
// Request
{
"id": 1,
"jsonrpc": "2.0",
"method": "supported_tokens",
"params": [
{
"chains": ["CHAIN_TYPE:CHAIN_ID", "..."], // optional
}
]
}
// Response
{
"jsonrpc": "2.0",
"id": 1,
"result": {
"tokens": [
{
"defuse_asset_identifier" : "eth:8453:0x123", // CHAIN_TYPE:CHAIN_ID:ADDRESS
"near_token_id": "...",
"decimals" : 18,
"asset_name" : "PEPE",
"min_deposit_amount": "100000"
"min_withdrawal_amount": "10000"
"withdrawal_fee": "1000"
},
// ...
]
}
}
2. Get deposit address
Returns the address for depositing supported tokens or native currency.
Parameters
account_id
- user account in NEAR Intents
chain
- network type and chain id. E.g.
eth:42161
for Arbitrum or
btc:mainnet
for Bitcoin
Response
address
- deposit address
chain
- network type and chain id
Example
//Request
{
"jsonrpc": "2.0",
"id": 1,
"method": "deposit_address",
"params": [
{
"account_id": "user.near",
"chain": "CHAIN_TYPE:CHAIN_ID"
}
]
}
//Response
{
"jsonrpc": "2.0",
"id": 1,
"result": {
"address": "0x....",
"chain": "CHAIN_TYPE:CHAIN_ID"
}
}
3. Get recent deposits
Returns information on recent deposits
Parameters
account_id
- user account in NEAR Intents
chain
- network type and chain id
Response
[].tx_hash
- transaction hash [EVM networks only]
[].chain
- network type and chain id
[].defuse_asset_identifier
- token identifier
[].decimals
- token decimals
[].amount
- asset amount
[].account_id
- user account NEAR Intents
[].address
- deposit address
[].status
- deposit status
Example
//Request
{
"jsonrpc": "2.0",
"id": 1,
"method": "recent_deposits",
"params": [
{
"account_id": "user.near",
"chain": "CHAIN_TYPE:CHAIN_ID"
}
]
}
//Response
{
"jsonrpc": "2.0",
"id": 1,
"result": {
"deposits": [
{
"tx_hash": "",
"chain": "CHAIN_TYPE:CHAIN_ID",
"defuse_asset_identifier": "eth:8543:0x123",
"decimals": 18,
"amount": 10000000000,
"account_id": "user.near",
"address": "0x123",
"status": "COMPLETED" // PENDING, FAILED
},
]
}
}
4. Get withdrawal status
Returns withdrawal status.
Parameters
withdrawal_hash
- hash of the transaction on NEAR where
ft_burn
event happened on the token contract
Response
status
- withdrawal status (
COMPLETED
,
PENDING
,
FAILED
,
NOT_FOUND
,
AWAITING
,
REJECTED
,
RETURNING
,
RETURNED
)
data.tx_hash
- burn transaction hash on NEAR
data.transfer_tx_hash
- transfer transaction hash on destination chain
data.chain
- network type and chain id
data.defuse_asset_identifier
- token identifier
data.decimals
- token decimals
data.amount
- asset amount
data.account_id
- user account
data.address
- withdrawal address
Example
// Request
{
"jsonrpc": "2.0",
"id": 1,
"method": "withdrawal_status",
"params": [
{
"withdrawal_hash": "some_hash",
}
]
}
// Response
{
"jsonrpc": "2.0",
"id": 1,
"result": {
"status": "COMPLETED"
"data": {
"tx_hash": "some_hash",
"transfer_tx_hash": "", // if exists
"chain": "CHAIN_TYPE:CHAIN_ID",
"defuse_asset_identifier": "eth:8543:0x123",
"decimals": 18,
"amount": 10000000000,
"account_id": "user.near",
"address": "0x123"
}
}
}
5. Notify about deposit transaction hash
Optional method that notifies service about your deposit.
Parameters
deposit_address
- address which you received from service api previously and where you transferred tokens
tx_hash
- hash of your deposit transaction
Response
error
- optional field in case of wrong input
Example
// Request
{
"jsonrpc": "2.0",
"id": 1,
"method": "notify_deposit",
"params": [
{
"deposit_address": "address",
"tx_hash": "hash"
}
]
}
// Response
{
"jsonrpc": "2.0",
"id": 1
}
6. Estimated withdrawal fees
Convenience method that estimates the fees for transactions.
Parameters
chain
- The blockchain network in format {network}:{chainId}
token
- The token identifier for which to estimate withdrawal fees
address
- Recipient address
Response
tokenAddress
- The address of the token contract
userAddress
- The user's address
withdrawalFee
- The estimated fee for withdrawal
withdrawalFeeDecimals
- The decimal precision of the withdrawal fee
token
- Token information details
error
- Error message if estimation fails
Example
// Request
{
"jsonrpc": "2.0",
"id": 1,
"method": "withdrawal_estimate",
"params": [
{
"chain": "eth:1",
"token": "eth.omft.near",
"address": "0x456def..."
}
]
}
// Response
{
"jsonrpc": "2.0",
"id": 1,
"result": {
"tokenAddress": "0x123abc...",
"userAddress": "0x456def...",
"withdrawalFee": "12500000000000000",
"withdrawalFeeDecimals": 18,
"token": {
"defuse_asset_identifier": "0x123abc...",
"near_token_id": "eth.omft.near",
"decimals": 18,
"asset_name": "ETH",
"min_deposit_amount": 0.001
}
}
}
Previous
Usage
Next
Verifier
Last updated
3 months ago


## Intent types and execution


Edit
Intent types and execution
Introduction
An intent is a desired action done on your account in the
Verifier
smart contract, performed by submitting a transaction to the NEAR blockchain. There are multiple possible actions that can be done, and the
Verifier
allows submitting a list of these actions to be done using
the function
execute_intents
.
Note on ordering of intent execution and atomicity
Multiple intents can be submitted to
execute_intents
in a list, as will be seen later in the examples, where all of them will be executed in the order they are provided. Because NEAR is an asynchronous and sharded blockchain, intents submitted in a sequence does not mean that they will complete in that sequence. This is because while individual intents will be executed in order, there is no guarantee that
calls/promises (asynchronous calls)
originating from the
Verifier
will end up finishing in order.
For example: The user submits a list of intents that will do two things:
Intent 1: Perform a
storage deposit
on usdc.near to create an account on it
Intent 2: Withdraw native NEAR from the user's account in the
Verifier
to
usdc.near
account
In this example, there is no guarantee that the whole process will be successful, given that we quantify the success of these intent by having them all pass. The
usdc.near
contract requires a storage deposit before tokens can be deposited. While the intent for storage deposit will be executed first, there is no guarantee that the calls emitted from it into the
usdc.near
smart contract will finish by the time the withdrawal function call is made.
Structure of intents call and their encoding
Intents are submitted as JSON objects written as strings in a payload object. The following is an example of a
Transfer
intent
USDC
tokens from Alice to Bob.
{
"intent"
:
"transfer"
,
"receiver_id"
:
"bob.near"
,
"tokens"
:
{
"nep141:wrap.near"
:
"10"
}
}
The intent does not mention Alice, as
the signer
of the intent defines the account that performs transfer.
This intent is part of the payload, which should have the following members:
signer_id - signer acount id
verifying_contract - contract address to which intents are sent
deadline - timestamp in ISO 8601 format
nonce - 256 bit value. It is very important to include it with the correct structure.which has clear
requirements
for structure
intents - array of intents
The "intents" in there contains the same intent from above, but in an array, because users can submit multiple intents to be executed as a batch in order. Keep in mind the
caveats explained here
about the order of execution.
{
"signer_id": "alice.near",
"verifying_contract": "intents.near",
"deadline": "2025-05-21T12:23:04.252814Z",
"nonce": "Vij2xgAlKBKzAMcLzEqKQRhRHXp3ThAEFTYtBmfhzvE=",
"intents": [
{
"intent": "transfer",
"receiver_id": "bob.near",
"tokens": {
"nep141:wrap.near": "10"
}
}
]
}
Finally, to create a valid, signed intent to submit to the
Verifier
contract with the
execute_intents
function, we put the payload above in a message string. Note that the message is the same JSON as above, but serialized as a one-liner with escaped quotes. This is very important.
{
"standard": "nep413",
"payload": {
"recipient": "intents.near",
"nonce": "Vij2xgAlKBKzgNPJFViEQRiSQad02gXP6pv9IQRCFeg=",
"message": "{\"deadline\":\"2025-05-21T10:34:04.254392Z\",\"intents\":
[{\"intent\":\"transfer\",\"receiver_id\":\"bob.near\",\"tokens\":{\"nep141:usdc.near\":\"10\"}}],
\"signer_id\":\"alice.near\"}"
},
"public_key": "ed25519:C3jXhkGhEx88Gj7XKtUziJKXEBMRaJ67bWFkxJikVxZ2",
"signature": "ed25519:2o7Cg7N8bEAKtEDbC9Nja8Ks1bJ9Nunh5Ems51G8oV6n96ckUVFeT81vr3TouE47R24HJSrLyxdeBEbvWeuizVBZ"
}
The field "recipient" prevents replay attacks on other copies of the
Verifier
on the NEAR blockchain. The exact cryptographic mechanisms for signing will be discussed in the
following sections
.
Types of intents
There are multiple
possible intents
that can be submitted for execution in the
Verifier
contract. Note that every intent has its own parametrization. The parameters needed to execute the intent can be seen in the linked docs. Rust
PascalCase
object names are usually converted to
snake_case
in JSON. Hence, an intent like
TokenDiff
becomes
token_diff
.
Let's discuss the available intents:
add_public_key
: Given an account id in the
Verifier
contract, the user can add public keys to this account. The added public key's private key can sign intents on behalf of this account, even to add new ones. Warning: Implicit account ids, by default, have their corresponding public keys added. This means if a private key is leaked for an implicit account used in intents, the user must manually rotate the public key in the Verifier.
Note that public keys can be added through transactions too. See
this section
for more information.
Example of an intent to add a public key:
[
{
"standard": "nep413",
"payload": {
"recipient": "intents.near",
"nonce": "Vij2xgAlKBKzwKyKBC58QRjK3paApkNO6LU77m306Vw=",
"message": "{\"deadline\":\"2025-05-21T08:04:27.483198Z\",\"intents\":
[{\"intent\":\"add_public_key\",\"public_key\":\"ed25519:5TagutioHgKLh7KZ1VEFBYfgRkPtqnKm9LoMnJMJugxm\"}],
\"signer_id\":\"alice.near\"}"
},
"public_key": "ed25519:C3jXhkGhEx88Gj7XKtUziJKXEBMRaJ67bWFkxJikVxZ2",
"signature": "ed25519:M6gK8WMNBL9vnkuScshNuKF5Yro5gQNRLpTTbruadR54AQvi53xWw8NizyCRbdM3j6y9XZ7MJy4DtQ1JLDz4xGQ"
}
]
remove_public_key
: Removes a public key associated with a given account.
Note that public keys can be removed through transactions too. See
this section
for more information.
Example of an intent to remove a public key:
[
{
"standard": "nep413",
"payload": {
"recipient": "intents.near",
"nonce": "Vij2xgAlKBKzAAxeFUp9QRi4FmMX9Jj6kmrjkUTtltk=",
"message": "{\"deadline\":\"2025-05-21T08:24:47.536976Z\",\"intents\":
[{\"intent\":\"remove_public_key\",\"public_key\":\"ed25519:5TagutioHgKLh7KZ1VEFBYfgRkPtqnKm9LoMnJMJugxm\"}],
\"signer_id\":\"alice.near\"}"
},
"public_key": "ed25519:C3jXhkGhEx88Gj7XKtUziJKXEBMRaJ67bWFkxJikVxZ2",
"signature": "ed25519:3E11skwith3ub3w22FnUdcqYzDFy698qBnP8FEPjZyZKbFtqUZK17AXGSLiwnHXppGrV8wbbGafX8fqXUvefoE8p"
}
]
Transfer
: Transfer a set of tokens from the signer to a specified account id, within the intents contract.
Note that transfers can be done using
through transactions too directly to the blockchain
.
Example of an intent to transfer coins within the
Verifier
contract from Alice's account to Bob's account:
[
{
"standard": "nep413",
"payload": {
"recipient": "intents.near",
"nonce": "Vij2xgAlKBKzgNPJFViEQRhm1GXQz/Vt+TS0PazCsJQ=",
"message": "{\"deadline\":\"2025-05-21T10:34:04.254392Z\",\"intents\":
[{\"intent\":\"transfer\",\"receiver_id\":\"bob.near\",\"tokens\":{\"nep141:usdc.near\":\"10\"}}],
\"signer_id\":\"alice.near\"}"
},
"public_key": "ed25519:C3jXhkGhEx88Gj7XKtUziJKXEBMRaJ67bWFkxJikVxZ2",
"signature": "ed25519:4nY7kjYV11djwsZ9UmezX1eoVMnzTg2wN6jT67o5vyWnibQ7g34zti8wc9imafbAzH5v4rqmksiextQCas14uxm5"
}
]
Note that token ids are specified in Multi Token format that was discussed in
this section
.
FtWithdraw
,
NftWithdraw
,
MtWithdraw
,
NativeWithdraw
are withdraw intents to move their tokens from the
Verifier
contract to an arbitrary address. More information
here
.
Example of an intent to withdraw from Alice's account to Bob's account. Notice that on success, the tokens will be in
usdc.near
contract under Bob's account there. The tokens have exited the
Verifier
contract:
[
{
"standard": "nep413",
"payload": {
"recipient": "intents.near",
"nonce": "Vij2xgAlKBKzgNPJFViEQRiRYtwetaXk8zFqV//Lq3c=",
"message": "{\"deadline\":\"2025-05-21T10:45:30.098925Z\",\"intents\":
[{\"intent\":\"ft_withdraw\",\"token\":\"usdc.near\",\"receiver_id\":\"bob.near\",\"amount\":\"1000\"}],
\"signer_id\":\"alice.near\"}"
},
"public_key": "ed25519:C3jXhkGhEx88Gj7XKtUziJKXEBMRaJ67bWFkxJikVxZ2",
"signature": "ed25519:XYNGWVRyGFGRVZAAn62k9r8qthzbj4a5Ct9eCjrSUW9hXpPRaBvqpLKXpaeBgsekfLFiTLdXMEitrbsZAmMmdmU"
}
]
StorageDeposit
: Make an
NEP-145
storage_deposit
call for an
account_id
on
contract_id
. The
amount
will be subtracted from user’s NEP-141
wNEAR
balance. The
wNEAR
will not be refunded in any case.
Example of an intent to perform storage deposit that will pay for storage deposit in the usdc.near smart contract. The Near token required (and specified) will be taken from
alice.near
account, and paid to
bob.near
in the
usdc.near
contract:
[
{
"standard": "nep413",
"payload": {
"recipient": "intents.near",
"nonce": "Vij2xgAlKBKzgNPJFViEQRhA/qs878LtXEL9iIjJC14=",
"message": "{\"deadline\":\"2025-05-21T11:06:28.803408Z\",\"intents\":
[{\"intent\":\"storage_deposit\",\"contract_id\":\"usdc.near\",\"account_id\":\"bob.near\",\"amount\":\"1250000000000000000000\"}],
\"signer_id\":\"alice.near\"}"
},
"public_key": "ed25519:C3jXhkGhEx88Gj7XKtUziJKXEBMRaJ67bWFkxJikVxZ2",
"signature": "ed25519:4rAYXBa9UY6Zw32dKcGrXgydParzzdygEwdAaaKRg9TxXSP9541rikLWhVCtJqFHJh4Rcvpp2YrbRQ4LBaay7Xa6"
}
]
TokenDiff
: The user declares the will to have a set of changes done to set of tokens. For example, a simple trade of 100 of token A for 200 of token B, can be represented by
TokenDiff
of {“A”: -100, “B”: 200} (this format is just for demonstration purposes). In general, the user can submit multiple changes with many tokens, not just token A for token B.
Example of two intents submitted from two users to be used with the
Verifier's
smart contract's
execute_intents
function. In the first intent, Alice declares that she is willing to lose 10
USDC
to get 10
USDT
in return. In the second intent, Bob declares their will to lose 10
USDT
and get 10
USDC
in return. As mentioned in the
introduction
, there are many different ways to put these intents together for submission to the blockchain, such as in the
Message Bus
or with third parties or any off-chain communication channel. Once a transaction is submitted calling the function
execute_intents
in the
Verifier's
smart contract, the
Verifier
solves the
TokenDiff
orders and converts them into transfers from Alice to Bob and Bob to Alice.
[
{
"standard": "nep413",
"payload": {
"recipient": "intents.near",
"nonce": "Vij2xgAlKBKzgMh0PGuHQRiOD4cMhPLCgZfb8bCmR7s=",
"message": "{\"deadline\":\"2025-05-21T11:30:25.042157Z\",\"intents\":
[{\"intent\":\"token_diff\",\"diff\":{\"nep141:usdc.near\":\"-10\",\"nep141:usdt.near\":\"10\"}}],
\"signer_id\":\"alice.near\"}"
},
"public_key": "ed25519:C3jXhkGhEx88Gj7XKtUziJKXEBMRaJ67bWFkxJikVxZ2",
"signature": "ed25519:2tKuCpxqtx6YUY6LRkQGeqmAizA8CKhkFtYdsHsAGRjwm4tFcPHHhBRGtuQAAbAkUkwJ6n2UptTP4Mpot1cTvf2u"
},
{
"standard": "nep413",
"payload": {
"recipient": "intents.near",
"nonce": "Vij2xgAlKBKzgMh0PGuHQRhE5M+mHoAocV57AzeIPuQ=",
"message": "{\"deadline\":\"2025-05-21T11:30:25.054132Z\",\"intents\":
[{\"intent\":\"token_diff\",\"diff\":{\"nep141:usdc.near\":\"10\",\"nep141:usdt.near\":\"-10\"}}],
\"signer_id\":\"bob.near\"}"
},
"public_key": "ed25519:C3jXhkGhEx88Gj7XKtUziJKXEBMRaJ67bWFkxJikVxZ2",
"signature": "ed25519:gTrJn3CaESvDJ765SDZ7JdkXupeGApjU6t66XpwrCXKM5K7b4VEeZXxL6NSL7i5zJ2Dn1aracg9xubktcPLwHEq"
}
]
\
\
\
Previous
Account Abstraction
Next
Signing Intents
Last updated
7 days ago


## Events


Edit
Events
In the NEAR blockchain,
events
are strings that are logged as a result of executing a smart contract function. Smart contracts can emit any events they wish to alert users to important on-chain actions.
The
Verifier
smart contract uses events to emit information about what happened in every intent and/or transaction function call. In this section, we will list some of the events used.
Structure of event strings
In the NEAR blockchain, events, based on
NEP-171
, are prefixed with the string
EVENT_JSON
. Smart contracts can then define custom event content freely. The
Verifier
contract uses strictly JSON objects in order to maintain easy programmability with detecting events.
Intents events
Below is a
list of the available events
and their explanation. These events are directly related to the
intent submitted
:
PublicKeyAdded
: Emitted when a public key is added to an account with an intent
PublicKeyRemoved
: Emitted when a public key was removed from an account with an intent
Transfer
: Emitted when a transfer between two accounts happens with an intent
TokenDiff
: Emitted when a
TokenDiff
intent executes successfully
IntentsExecuted
: Emitted after successfully having executed the listed intents
FtWithdraw
,
NftWithdraw
,
MtWithdraw
,
NativeWithdraw
: Emitted when a withdraw intent is made. Note that many times it is difficult to emit only on success because this depends on cross-contract calls.
StorageDeposit
: Emitted when a storage deposit intent is submitted.
Multi Token events
Multi Token events are emitted to indicate a change in the internal balances of the
Verifier
contract. The following are the
available events
.
MtMintEvent
: Is emitted when the balance of a given account in the
Verifier
smart contract increases, due to deposits.
MtBurnEvent
: Is emitted when the balance of a given account in the
Verifier
smart contract decreases, due to withdrawals.
MtTransferEvent
: After executing intents like
TokenDiff
, the requests inside of it are converted eventually to transfers between accounts by fulfilling all the requests in it. This event is emitted to indicate that tokens have "changed hands", or moved between accounts.
To understand the reasoning behind the naming, one can imagine the
Verifier
as a set of isolated balances that can either increase, decrease or move between accounts. Although balances are conserved and simply moved between accounts, from the Verifier contract’s perspective, increasing token amounts is equivalent to minting, and decreasing them is akin to burning.
This picture stems primarily from a discussion in
this section
, where all tokens use the Multi Token standard for storage inside the
Verifier
smart contract.
Previous
Signing Intents
Next
Example Transactions
Last updated
6 months ago


## Account Abstraction


Edit
Account Abstraction
The
Verifier
contract currently identifies users via their NEAR
AccountId
, which can be either a Named or Implicit account.
Named Account:
user.near
The only way to start using a Named Account is to send a real tx
intents.near::add_public_key(pk)
from user's NEAR wallet. Others can still deposit or transfer funds to you before you "claim" the account.
Implicit Account
Such accounts already have a public key encoded in their names, so they can be used without any "claiming" from users.
There is 1-to-1 relationship between its format and corresponding signing curve types:\
EdDSA:
8c5cba35f5b4db9579c39175ad34a9275758eb29d4866f395ed1a5b5afcb9ffc
(i.e. "Implicit NEAR")
ECDSA:
0x85d456B2DfF1fd8245387C0BfB64Dfb700e98Ef3
(i.e. "Implicit Eth")
For example, users logging in with a Cosmos (ECDSA) wallet will have an
Implicit Eth address
in
intents.near
, whereas Solana or Ton (EdDSA) wallets will yield
Implicit NEAR addresses
.
It's not feasible to differentiate these addresses by chain, since we only know the signature and public key. Even when differentiating between them based on the used signing standard (NEP-413, EIP-712), it still results in ambiguity when importing the same seed phrase into multiple wallets.
Account keys
Once an account is created, multiple additional public keys could be added to it to authorize actions on that account. Each of these keys has full control over the account and can add or remove other keys either directly via NEAR transactions or via signed intents.
Encoding Requirements for the Verifier Contract
Curve
Public Key
Signature
Ed25519
32 bytes
64 bytes
Secp256k1
64 bytes (uncompressed)
65 bytes (r || s || v)
P256
64 bytes (uncompressed)
64 bytes (r || s)
Important: Compressed public keys are not supported for ECDSA curves (Secp256k1, P256). Public keys must be in uncompressed format (raw 64-byte x || y coordinates without prefix bytes).
Signatures must be in raw concatenated byte format, not DER-encoded.
Here is an example of adding public keys for Explicit NEAR Accounts via
tx
.
You can also do it manually with
near-cli
:
near contract call-function as-transaction \
intents.near add_public_key json-args '{
"public_key": "ed25519:<base58>"
}' prepaid-gas '100.0 Tgas' attached-deposit '1 yoctoNEAR' \
sign-as <ACCOUNT_ID> network-config mainnet sign-with-keychain send
In addition to directly calling the
add_public_key
method it's also possible to submit a signed intent:
{
"signer_id": "<ACCOUNT_ID>",
// ...
"intents": [
{
"intent": "add_public_key",
"public_key": "<PUBLIC_KEY_OF_USER>"
},
]
}
Authentication Flow example via Frontends
Users' wallets store their private keys and allow users to rotate them. In order to verify signatures inside of
Verifier
,
Verifier
should know which keys are associated with which "named" accounts. Therefore,
intents.near
contract should maintain a
of mapping of
account_ids
to their
public_keys
(again, each
account_id
can have multiple
public_keys
registered). This copy should include a subset of valid public keys that were added as Full Access Keys to each NEAR account that wants to interact with Intents.
When a user
user1
opens the Frontend for the first time and clicks "Connect Wallet", the frontend prompts the user's wallet to
signMessage("Authenticate")
. As a result, we get a signature and, more importantly, the
public_key
as a counterpart of a Full Access Key that was used to sign this message and the
account_id
which the public_key corresponds to. The frontend would store this pair
(account_id, public_key)
in browser's local storage.
Now, when a user wants to swap tokens, i.e. sign a
state_change
:
First, check if this pair
(account_id, public_key)
is already registered in Intents contract on-chain by calling
get_account_public_keys(account_id) -> Vec<Pubkey>
method on
intents.near
contract.
If there is no such user or if public_key was not registered for him, the user should be "registered" in Intents contract. For that we should ask user's wallet to
signMessage("user1 is an owner of public_key ed25519:abcd...")
This signed message is than included in the transaction (by
Message Bus
) to
intents.near
calling
add_public_key({"account_id": "user1", "public_key": "ed25519:abcd...", "signature": "xyz123..."})
method. This transaction would add
ed25519:abcd...
to the list of public_keys that belongs to
user1
The user's wallet should sign
signMessage({"account_id": "user1", "state_changes": [...] })
and this state_change along with the returned signature and public_key would be eventually sent by a market maker to the
intents.near
.
When
intents.near
receives transaction with such signature, it validates the signature for given
public_key
and atomically checks whether the
public_key
is registered for
user1
.
A challenge arises when a user removes his
Full Access Key
, it should also be unregistered on
intents.near
contract by calling
remove_public_key(public_key)
method sent from user's NEAR account. This can be automated by adding a
FunctionalKey
added to user's account on NEAR and call by ourselves whenever we detect that our user has deleted a key from his NEAR account on-chain.
Previous
Withdrawals
Next
Intent types and execution
Last updated
1 month ago


## Example Transactions


Edit
Example Transactions
Examples of supported transactions are listed:
add_public_key
remove_public_key
execute_intents
(1 withdrawal intent)
NEP-141:
deposit
deposit-then-execute-intents
(1 withdrawal intent)
deposit-swap-withdraw
(~1 NEAR -> ~5 USDT)
withdrawal by transaction
Getting balances via CLI:
near contract call-function as-read-only \
defuse-alpha.near mt_batch_balance_of \
json-args '{
"account_id": "defuse-ops.near",
"token_ids": [
"nep141:wrap.near",
"nep141:usdt.tether-token.near"
]
}' network-config mainnet now
--------------
[
"3000004000004000006",
"10"
]
--------------
Previous
Events
Next
Simulating intents
Last updated
6 months ago


## Simulating intents


Edit
Simulating intents
In this chapter we have discussed several methods to execute intents in the
Verifier
smart contract. The
execute_intents
function calls a mutable and modifies the
Verifier
contract’s state.
However, the
Verifier
smart contract offers the possibility to simulate intents using
the function
simulate_intents
. Simulation of intents is the process of running the code of the intents provided, without modifying the state of the
Verifier
smart contract.
Examples where simulations can be useful
Alice constructs an intent, and is not sure whether the format of the digital signature is valid
Bob is constructing an intent to withdraw his
USDC
coins from the
Verifier
contract, and wants to ensure that it will work before executing it
Charlie and Drake want to execute a trade using two intents of
TokenDiff
, but they are not sure about the fees that will be paid to the
Verifier
smart contract
Example outputs for simulating intents
The following is a valid, signed intents to trade 100
USDC
for 100
USDT
. It has two intents, one from Charlie, expressing his intent to lose 100
USDC
to get 100
USDT
in return, while drake expressing the opposite. For more information about this structure, see
this section
.
{
"signed": [
{
"standard": "nep413",
"payload": {
"recipient": "intents.near",
"nonce": "Vij2xgAlKBKzwJcGrQQYQhiLk1HU5AVNH1M3PhtxosE=",
"message": "{\"deadline\":\"2025-05-23T07:40:13.735337Z\",\"intents\":
[{\"intent\":\"token_diff\",\"diff\":{\"nep141:usdc.near\":\"-100\",\"nep141:usdt.near\":\"100\"}}],
\"signer_id\":\"charlie.near\"}"
},
"public_key": "ed25519:C3jXhkGhEx88Gj7XKtUziJKXEBMRaJ67bWFkxJikVxZ2",
"signature": "ed25519:617X6QMiwFohRHqEuFwZ8aGU6Gn8PsH1DM3grArCYSKSvLz4wBPPGLzLPX3SLstLB331ESGPUToaPkUE7DvgefUu"
},
{
"standard": "nep413",
"payload": {
"recipient": "intents.near",
"nonce": "Vij2xgAlKBKzwJcGrQQYQhjtxxGCsZQhM2DP7btPexE=",
"message": "{\"deadline\":\"2025-05-23T07:40:13.753085Z\",\"intents\":
[{\"intent\":\"token_diff\",\"diff\":{\"nep141:usdc.near\":\"100\",\"nep141:usdt.near\":\"-100\"}}],
\"signer_id\":\"drake.near\"}"
},
"public_key": "ed25519:C3jXhkGhEx88Gj7XKtUziJKXEBMRaJ67bWFkxJikVxZ2",
"signature": "ed25519:3mLCEKyhofYLVakC9qgyb2FWh4L3jQxnUNyBHxYMTC13bo9y4AeqRh29dDYC4ZAQk4Z4mA2QZL8y7KGGKp5Pc3S1"
}
]
}
Calling
simulate_intents
with the above mentioned intents list produces the following output:
{
"intents_executed": [
{
"intent_hash": "5GpL6PsUQVHFYAk5FWEwBUaEQqcZkc2SjTvPYHgHAnx8",
"account_id": "charlie.near",
"nonce": "Vij2xgAlKBKzwJcGrQQYQhiLk1HU5AVNH1M3PhtxosE="
},
{
"intent_hash": "4ejradLAAPBhBVAn6tBYExpuj2VCn5f5VEBfVajNXiXk",
"account_id": "drake.near",
"nonce": "Vij2xgAlKBKzwJcGrQQYQhjtxxGCsZQhM2DP7btPexE="
}
],
"logs": [
"EVENT_JSON:{\"data\":[{\"account_id\":\"charlie.near\",\"diff\":{\"nep141:usdc.near\":\"-100\",\"nep141:usdt.near\":\"100\"},\"intent_hash\":\"5GpL6PsUQVHFYAk5FWEwBUaEQqcZkc2SjTvPYHgHAnx8\"}],\"event\":\"token_diff\",\"standard\":\"dip4\",\"version\":\"0.3.0\"}",
"EVENT_JSON:{\"data\":[{\"account_id\":\"drake.near\",\"diff\":{\"nep141:usdc.near\":\"100\",\"nep141:usdt.near\":\"-100\"},\"intent_hash\":\"4ejradLAAPBhBVAn6tBYExpuj2VCn5f5VEBfVajNXiXk\"}],\"event\":\"token_diff\",\"standard\":\"dip4\",\"version\":\"0.3.0\"}",
"EVENT_JSON:{\"data\":[{\"account_id\":\"charlie.near\",\"intent_hash\":\"5GpL6PsUQVHFYAk5FWEwBUaEQqcZkc2SjTvPYHgHAnx8\",\"nonce\":\"Vij2xgAlKBKzwJcGrQQYQhiLk1HU5AVNH1M3PhtxosE=\"},{\"account_id\":\"drake.near\",\"intent_hash\":\"4ejradLAAPBhBVAn6tBYExpuj2VCn5f5VEBfVajNXiXk\",\"nonce\":\"Vij2xgAlKBKzwJcGrQQYQhjtxxGCsZQhM2DP7btPexE=\"}],\"event\":\"intents_executed\",\"standard\":\"dip4\",\"version\":\"0.3.0\"}"
],
"min_deadline": "2025-05-23T07:40:13.735337Z",
"state": {
"fee": 100,
"current_salt": "252812b3"
}
}
Where
intents_executed - all intents events, collected during simulation, containing signer,
nonce
and intent hash
logs - all collected defuse events which will be emitted during intent execution
min_deadline - minimum deadline among all intents
state - current state configurations containing fee and
salt
The fees are expressed in pips - 100 pips is 0.01%.
Simulation outputs may include additional data in future updates. This is a basic example. Contact NEAR Intents Team if your application requires more detailed output.
Accuracy of simulations
Simulated results are designed to closely match actual execution outcomes. This is the intended outcome from the programming and heavy testing done for simulated intents. However, due to the asynchronous nature of the NEAR blockchain, ultimate code abstraction to simulate the intents exactly like they would be in real execution is not possible.
To date, simulation and execution results have always matched. If you ever discover such a case, please contact the NEAR Intents team and report it as a bug.
Note: Simulations reflect only side effects within the
Verifier
contract and exclude those from external asynchronous calls.
Previous
Example Transactions
Next
FAQs
Last updated
7 days ago

