/**
 * utils/formatters.js  — PLACEHOLDER
 *
 * Pure utility functions for display formatting.
 *
 * TODO: implement each function.
 */

import { formatEther } from 'ethers';

/**
 * Truncate an Ethereum address for display.
 * e.g. 0x1234...abcd
 *
 * @param {string} address
 * @param {number} [chars=4]
 * @returns {string}
 */
export function truncateAddress(address, chars = 4) {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format a wei amount to a readable ETH string.
 * @param {bigint|string} wei
 * @param {number} [decimals=4]
 * @returns {string}
 */
export function formatWei(wei, decimals = 4) {
  // TODO: add locale-aware formatting
  const eth = formatEther(wei);
  return `${parseFloat(eth).toFixed(decimals)} ETH`;
}

/**
 * Convert a Unix timestamp to a human-readable date string.
 * @param {number} timestamp
 * @returns {string}
 */
export function formatTimestamp(timestamp) {
  if (!timestamp || timestamp === 0) return 'No deadline';
  return new Date(timestamp * 1000).toLocaleString();
}

/**
 * Map an escrow state enum value (uint8) to a readable label.
 * @param {number} state
 * @returns {string}
 */
export function formatEscrowState(state) {
  const labels = [
    'Awaiting Payment',
    'Awaiting Delivery',
    'Complete',
    'Disputed',
    'Refunded',
    'Cancelled',
  ];
  return labels[state] ?? 'Unknown';
}

