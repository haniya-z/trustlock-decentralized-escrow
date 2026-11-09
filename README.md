# TrustLock — Decentralized Escrow Protocol

> **Milestone 0 — Project Scaffolding** | Smart contract and frontend are placeholders. See [docs/development-roadmap.md](docs/development-roadmap.md).

TrustLock is a trustless, on-chain escrow application. It lets a **buyer** lock ETH inside a smart contract and release it to a **seller** only after confirming delivery — no bank, no middleman, no trust required.

## Tech Stack

| Layer | Technology |
|---|---|
| Smart Contract | Solidity 0.8.24 + OpenZeppelin v5 |
| Development | Hardhat 2 |
| Frontend | React 18 + Vite 5 |
| Blockchain Client | Ethers.js v6 |
| Wallet | MetaMask (EIP-1193) |
| Routing | React Router v6 |

## Folder Structure

```
trustlock/
├── contracts/          Solidity smart contracts
├── scripts/            Hardhat deployment scripts
├── ignition/           Hardhat Ignition modules
├── test/               Contract unit tests (Mocha + Chai)
├── frontend/           React + Vite dApp
│   └── src/
│       ├── pages/      Route-level page components
│       ├── components/ Reusable UI components
│       ├── hooks/      Custom React hooks
│       ├── context/    React Context providers
│       ├── services/   Ethers.js contract interaction layer
│       ├── contract/   ABI + deployed address config
│       └── utils/      Pure utility functions
└── docs/               Architecture, security, roadmap
```

## Quick Start

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9
- MetaMask browser extension

### 1. Install root dependencies (Hardhat)
```bash
cd trustlock
npm install
```

### 2. Install frontend dependencies
```bash
cd frontend
npm install
```

### 3. Compile the smart contract
```bash
# Back in project root
npm run compile
```

### 4. Run contract tests
```bash
npm test
```

### 5. Start a local Ethereum node
```bash
npm run node
```

### 6. Deploy to local node (in a second terminal)
```bash
npm run deploy:local
```

### 7. Start the frontend dev server
```bash
cd frontend
npm run dev
# → http://localhost:3000
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your values (never commit `.env`):

```bash
cp .env.example .env
```

## Documentation

- [Architecture](docs/architecture.md)
- [Security Objectives](docs/security.md)
- [Development Roadmap](docs/development-roadmap.md)

## ⚠️ Disclaimer

This project is a work-in-progress. The smart contract has **not been audited**. Do **not** use with real funds on mainnet.

