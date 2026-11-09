# TrustLock — Development Roadmap

## Milestone 0 — Project Scaffolding ✅ (Current)

> Status: **In Progress**

- [x] Monorepo folder structure
- [x] Root `package.json` with Hardhat 2 + Ethers.js v6
- [x] `hardhat.config.js` with local/Sepolia/Hardhat networks
- [x] Frontend `package.json` with React 18 + Vite 5
- [x] Placeholder `Escrow.sol` with state machine types, events, and modifiers
- [x] Deployment script (`scripts/deploy.js`)
- [x] Hardhat Ignition module
- [x] Starter test suite skeleton
- [x] Starter React pages and service stubs
- [x] Documentation files

---

## Milestone 1 — Smart Contract Core

> Target: Local + unit-tested

### Tasks
- [ ] Implement `createDeal()` with full fund locking
- [ ] Implement `confirmDelivery()` with CEI pattern and ETH transfer
- [ ] Implement `refundBuyer()` with CEI pattern and ETH transfer
- [ ] Implement `raiseDispute()` state transition
- [ ] Implement `resolveDispute()` with arbiter payout
- [ ] Implement platform fee deduction on `confirmDelivery`
- [ ] Implement deadline enforcement
- [ ] Write full test suite (all 🔲 tests in `test/Escrow.js`)
- [ ] Run `npx hardhat coverage` — target 95 %+ branch coverage
- [ ] Run Slither static analysis — fix all medium/high issues

---

## Milestone 2 — Frontend Integration

> Target: Local dApp connected to Hardhat node

### Tasks
- [ ] Implement `useWallet` hook (connect, disconnect, account/chainId state)
- [ ] Implement `WalletContext` and wrap `<App />`
- [ ] Implement `blockchain.js` helpers
- [ ] Implement `escrowService.js` (all read + write functions)
- [ ] Update `contract/config.js` with real ABI (post-compile) and local address
- [ ] Wire `CreateEscrow` form to `escrowService.createDeal()`
- [ ] Wire `Dashboard` to `escrowService.getDealsByAddress()`
- [ ] Wire `EscrowDetails` action buttons to service functions
- [ ] Add `<Navbar />` with wallet connect button
- [ ] Add transaction pending / success / error notifications
- [ ] Add network mismatch warning

---

## Milestone 3 — Testnet Deployment

> Target: Sepolia testnet

### Tasks
- [ ] Deploy `Escrow.sol` to Sepolia
- [ ] Verify contract on Etherscan
- [ ] Update `contract/config.js` with Sepolia address
- [ ] End-to-end QA with real MetaMask transactions
- [ ] Update `.env.example` with live RPC URL patterns

---

## Milestone 4 — UI Polish & UX

> Target: Production-quality interface

### Tasks
- [ ] Add Tailwind CSS (or styled-components)
- [ ] Design system: colours, typography, spacing tokens
- [ ] Responsive layout (mobile-first)
- [ ] Dark mode
- [ ] Empty states, loading skeletons, error boundaries
- [ ] Transaction history timeline

---

## Milestone 5 — Advanced Features

> Target: Feature-complete v1

### Tasks
- [ ] Multi-network support (Polygon, Arbitrum, Base)
- [ ] Chainlink Automation for deadline-based auto-refunds
- [ ] IPFS integration for deal descriptions
- [ ] The Graph subgraph for event indexing
- [ ] Kleros / DAO arbitration module
- [ ] OpenZeppelin Pausable emergency stop
- [ ] Formal security audit

---

## Milestone 6 — Mainnet Launch

- [ ] Final audit sign-off
- [ ] Bug bounty programme
- [ ] Multisig owner via Safe
- [ ] Mainnet deployment
- [ ] Public launch

