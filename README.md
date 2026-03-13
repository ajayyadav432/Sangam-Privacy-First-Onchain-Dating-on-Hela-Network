# ChainDate 💜 — Privacy-First Onchain Dating on Hela Network

> **HackJKLU v5.0 · Hela Labs Track**  
> A fully on-chain, ZK-private dating dApp. Swipe, match, and connect — without exposing your identity.

---

## Architecture

```
JK/
├── blockchain/          # Hardhat + Solidity smart contracts
│   ├── contracts/
│   │   ├── DatingCore.sol       ← Profile reg, swipes, fees, matching
│   │   ├── EscrowContent.sol    ← Exclusive content escrow unlock
│   │   └── MockZKVerifier.sol   ← ZK proof mock (swap-ready)
│   ├── circuits/
│   │   └── matchVerifier.circom ← Circom ZK circuit (age + interests)
│   ├── scripts/deploy.ts
│   └── test/DatingCore.test.ts
└── frontend/            # Next.js 14 + Tailwind CSS
    ├── app/             # App router pages
    ├── components/      # SwipeCard, WalletConnect, ProfileForm, etc.
    └── lib/             # zk.ts, encryption.ts, contracts.ts
```

## Tech Stack

| Layer | Tech |
|---|---|
| Smart Contracts | Solidity 0.8.20, Hardhat, ethers.js |
| ZK Privacy | Circom circuit + MockZKVerifier (SnarkJS-compatible interface) |
| Frontend | Next.js 14 (App Router), Tailwind CSS, ethers.js |
| Wallet | MetaMask / any EVM wallet via `window.ethereum` |
| Network | **Hela Network** (EVM-compatible, chainId: 666888 testnet) |
| Encryption | Web Crypto API (AES-CBC client-side field encryption) |

## Key Features

- 🔐 **ZK Privacy**: Age + interest overlap proven via zero-knowledge proof. Identity never exposed on-chain.
- ⛓️ **Fully Onchain**: Every swipe, match, and message is a smart contract transaction.
- 💸 **Micro-Economy**: 0.001 HELA per swipe, 0.0005 HELA per message (pay-per-use model).
- 🔒 **Encrypted Profiles**: Name/bio AES-encrypted client-side; only hash stored on-chain.
- 🎁 **Exclusive Content Escrow**: Creators lock content; buyers unlock via `EscrowContent.sol`.

---

## Quick Start

### 1. Blockchain (Smart Contracts)

```bash
cd blockchain
npm install
cp .env.example .env   # fill in PRIVATE_KEY

# Local development
npx hardhat node                              # start local Hardhat node
npx hardhat run scripts/deploy.ts --network localhost

# Deploy to Hela Testnet
npx hardhat run scripts/deploy.ts --network helaTestnet

# Run tests
npx hardhat test
```

### 2. Frontend

```bash
cd frontend
npm install
# Add deployed contract addresses to .env.local:
# NEXT_PUBLIC_DATING_CORE=0x...
# NEXT_PUBLIC_ESCROW_CONTENT=0x...
# NEXT_PUBLIC_ZK_VERIFIER=0x...

npm run dev        # http://localhost:3000
```

---

## Smart Contract Summary

### `DatingCore.sol`
| Function | Fee | Description |
|---|---|---|
| `registerProfile(hash, interests)` | free | Store encrypted profile hash |
| `swipe(target, liked, proof, signals)` | 0.001 HELA | Like/pass with ZK verification |
| `sendMessage(recipient)` | 0.0005 HELA | Pay-per-message (80% to recipient) |
| `storeChatKey(partner, encKey)` | free | Store encrypted E2E chat key |

### `EscrowContent.sol`
| Function | Description |
|---|---|
| `listContent(hash, price)` | Creator lists exclusive content |
| `unlockContent(listingId)` | Buyer pays to unlock (2.5% protocol fee) |
| `cancelListing(listingId)` | Creator reclaims after 7-day lock |

### `MockZKVerifier.sol`
Mirrors the interface of a SnarkJS Groth16 verifier — swap for real ZK verifier in production with zero changes to callers.

---

## ZK Proof Flow

```
User                         ZKP Layer                    Smart Contract
  |                              |                               |
  |--- private inputs ---------> |                               |
  |    (age, interests)          |                               |
  |                              |--- generateMockProof() ----> |
  |                              |    ageValid=1                 |
  |                              |    interestOverlap=N          |
  |                              |                               |
  |<-- proofBytes + signals ---- |                               |
  |                              |                               |
  |--- swipe(proof, signals) -----------------------> DatingCore |
                                                      verifyProof()
                                                      → match logic
```

---

## Hela Network Configuration

| Config | Value |
|---|---|
| Network Name | Hela Testnet |
| Chain ID | 666888 |
| RPC URL | `https://testnet-rpc.helachain.com` |
| Explorer | `https://testnet-blockscout.helachain.com` |
| Currency | HELA |

---

*Built with 💜 for HackJKLU v5.0 by Team ChainDate*
