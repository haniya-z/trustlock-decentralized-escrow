/**
 * contract/config.js
 * Contract address and ABI for the deployed Escrow contract.
 *
 * HOW TO UPDATE:
 *  1. Run `npm run compile` in the project root.
 *  2. Run `npm run deploy:local` (or deploy to a testnet).
 *  3. Copy the deployed address here.
 *  4. Copy the ABI from artifacts/contracts/Escrow.sol/Escrow.json
 *     into the CONTRACT_ABI array below (or import the JSON directly).
 *
 * TODO: automate this via the deploy script (write address + ABI to this file).
 * TODO: support multiple networks via VITE_NETWORK env variable.
 */

// ── Deployed contract address ────────────────────────────────────────────────
// Replace with the actual address after deploying.
export const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

// ── ABI ───────────────────────────────────────────────────────────────────────
// Minimal ABI — expand after `npm run compile` produces the full artifact.
// TODO: replace with the auto-generated full ABI from artifacts/.
export const CONTRACT_ABI = [
  // Events
  'event DealCreated(uint256 indexed dealId, address indexed buyer, address indexed seller, uint256 amount, uint256 deadline)',
  'event FundsDeposited(uint256 indexed dealId, address indexed buyer, uint256 amount)',
  'event FundsReleased(uint256 indexed dealId, address indexed seller, uint256 amount)',
  'event RefundIssued(uint256 indexed dealId, address indexed buyer, uint256 amount)',
  'event DisputeRaised(uint256 indexed dealId, address indexed raisedBy)',
  'event DisputeResolved(uint256 indexed dealId, address indexed winner, uint256 amount)',

  // Read
  'function getDeal(uint256 dealId) view returns (tuple(uint256 id, address buyer, address seller, address arbiter, uint256 amount, uint8 state, uint256 createdAt, uint256 deadline, string description))',
  'function nextDealId() view returns (uint256)',
  'function feeBasisPoints() view returns (uint256)',
  'function owner() view returns (address)',

  // Write
  'function createDeal(address seller, address arbiter, uint256 deadline, string description) payable returns (uint256)',
  'function confirmDelivery(uint256 dealId)',
  'function refundBuyer(uint256 dealId)',
  'function raiseDispute(uint256 dealId)',
  'function resolveDispute(uint256 dealId, address winner)',
  'function setFeeBasisPoints(uint256 newFeeBasisPoints)',
];

