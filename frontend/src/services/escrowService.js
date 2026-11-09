/**
 * services/escrowService.js
 * High-level service layer for interacting with the Escrow smart contract.
 *
 * All functions here wrap raw Ethers.js contract calls and return
 * normalised JavaScript objects — keeping the UI decoupled from the ABI.
 *
 * TODO: implement each function body.
 * TODO: import ABI from the compiled artifact (after `npm run compile`).
 * TODO: import contract address from contract/config.js.
 * TODO: add transaction status callbacks (pending, mined, failed).
 */

import { Contract, parseEther } from 'ethers';
import { connectWallet } from './blockchain.js';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contract/config.js';

// ─────────────────────────────────────────────────────────────────────────────
// Internal helper
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns an Escrow contract instance connected to the user's signer.
 * @returns {Promise<Contract>}
 */
async function getContract() {
  const signer = await connectWallet();
  return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

// ─────────────────────────────────────────────────────────────────────────────
// Write operations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a new escrow deal.
 *
 * @param {object} params
 * @param {string} params.seller        - Ethereum address of the seller
 * @param {string} params.arbiter       - Ethereum address of arbiter (or '' for none)
 * @param {string} params.amountEther   - Amount in ETH as a string (e.g. "1.5")
 * @param {number} params.deadlineUnix  - Unix timestamp (0 = no deadline)
 * @param {string} params.description   - Human-readable description
 * @returns {Promise<object>} transaction receipt
 *
 * TODO: implement
 */
export async function createDeal({ seller, arbiter, amountEther, deadlineUnix, description }) {
  // const contract = await getContract();
  // const tx = await contract.createDeal(seller, arbiter || ethers.ZeroAddress, deadlineUnix, description, {
  //   value: parseEther(amountEther),
  // });
  // return tx.wait();
  console.warn('escrowService.createDeal: not yet implemented');
  throw new Error('Not implemented');
}

/**
 * Buyer confirms delivery — releases funds to the seller.
 * @param {number|bigint} dealId
 * @returns {Promise<object>} transaction receipt
 *
 * TODO: implement
 */
export async function confirmDelivery(dealId) {
  console.warn('escrowService.confirmDelivery: not yet implemented');
  throw new Error('Not implemented');
}

/**
 * Seller refunds the buyer.
 * @param {number|bigint} dealId
 * @returns {Promise<object>} transaction receipt
 *
 * TODO: implement
 */
export async function refundBuyer(dealId) {
  console.warn('escrowService.refundBuyer: not yet implemented');
  throw new Error('Not implemented');
}

/**
 * Raise a dispute on a deal.
 * @param {number|bigint} dealId
 * @returns {Promise<object>} transaction receipt
 *
 * TODO: implement
 */
export async function raiseDispute(dealId) {
  console.warn('escrowService.raiseDispute: not yet implemented');
  throw new Error('Not implemented');
}

/**
 * Arbiter resolves a dispute.
 * @param {number|bigint} dealId
 * @param {string} winnerAddress
 * @returns {Promise<object>} transaction receipt
 *
 * TODO: implement
 */
export async function resolveDispute(dealId, winnerAddress) {
  console.warn('escrowService.resolveDispute: not yet implemented');
  throw new Error('Not implemented');
}

// ─────────────────────────────────────────────────────────────────────────────
// Read operations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch a single deal from the contract.
 * @param {number|bigint} dealId
 * @returns {Promise<object>} normalised deal object
 *
 * TODO: implement — call contract.getDeal(dealId) and map fields.
 */
export async function getDeal(dealId) {
  console.warn('escrowService.getDeal: not yet implemented');
  return null;
}

/**
 * Fetch all deal IDs associated with a wallet address.
 * NOTE: Solidity doesn't natively support "fetch by address" — this will
 * rely on event logs (DealCreated) filtered by buyer/seller address.
 *
 * @param {string} address
 * @returns {Promise<bigint[]>} array of deal IDs
 *
 * TODO: implement using contract.queryFilter()
 */
export async function getDealsByAddress(address) {
  console.warn('escrowService.getDealsByAddress: not yet implemented');
  return [];
}

