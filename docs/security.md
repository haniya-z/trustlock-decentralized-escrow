# TrustLock — Security Objectives

## Threat Model

TrustLock holds user funds directly in a smart contract. Any vulnerability can lead to irreversible financial loss. This document outlines the security objectives, known risks, and planned mitigations.

## Smart Contract Security Principles

### 1. Checks-Effects-Interactions (CEI)
All state-mutating functions follow the CEI pattern:
1. **Check** inputs and preconditions (custom errors, modifiers).
2. **Effect** — update state variables.
3. **Interact** — perform external calls or ETH transfers last.

### 2. Reentrancy Protection
`ReentrancyGuard` from OpenZeppelin is applied to all functions that transfer ETH (`confirmDelivery`, `refundBuyer`, `resolveDispute`).

### 3. Access Control
- `Ownable` restricts admin functions to the platform owner.
- Custom modifiers (`onlyBuyer`, `onlySeller`) enforce role-based access per deal.
- Arbiters are nominated per deal and cannot exceed their role.

### 4. Integer Overflow / Underflow
Solidity 0.8.x has built-in overflow checks. No `unchecked` blocks are used without explicit justification.

### 5. Timestamp Dependence
`block.timestamp` is used only for `deadline` comparisons — with a tolerance understanding that miners can nudge timestamps by ~15 seconds. No high-value logic depends on sub-minute timestamp precision.

### 6. No Delegate Calls
The contract does not use `delegatecall`, proxy patterns, or selfdestruct in the initial version.

## Known Limitations (TODO)

- [ ] **Arbiter collusion**: An arbiter could collude with one party. Mitigation: decentralised arbitration (Kleros) or DAO voting — planned for Phase 3.
- [ ] **Fee extraction**: Platform fee is currently a basis-point state variable but is not deducted from transfers yet.
- [ ] **No deadline enforcement**: Deadline is stored but no automatic refund is triggered on expiry (requires keeper or Chainlink Automation).
- [ ] **Off-chain descriptions**: Description is stored in calldata/state; for large strings, IPFS content hashes should be used instead.

## Planned Audit Checklist

Before mainnet deployment:

- [ ] Static analysis with Slither
- [ ] Fuzzing with Echidna or Foundry
- [ ] Manual line-by-line review by an independent auditor
- [ ] Gas optimisation review (storage packing, event indexing)
- [ ] Third-party formal audit

## Dependency Trust

| Dependency | Version | Why trusted |
|---|---|---|
| `@openzeppelin/contracts` | v5 | Industry-standard, audited |
| `hardhat` | v2 | Development tool only, not deployed |
| `ethers` | v6 | Frontend only, not in contract |

## Incident Response (Planned)

- TODO: add `pause()` / `unpause()` via OpenZeppelin `Pausable`.
- TODO: add an emergency withdrawal function callable only by owner after a timelock.
- TODO: set up a bug bounty programme before mainnet.

