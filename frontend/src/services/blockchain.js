/**
 * services/blockchain.js
 * Low-level Ethers.js v6 utilities for connecting to the Ethereum network.
 *
 * Responsibilities:
 *  - Detect and connect to MetaMask (or any EIP-1193 provider)
 *  - Return a signer for write operations
 *  - Return a provider for read-only operations
 *
 * TODO: add network switching / detection (chainId guard).
 * TODO: handle the case where window.ethereum is undefined (no wallet installed).
 * TODO: emit events on account / network change so the UI can react.
 * TODO: support WalletConnect as a fallback provider.
 */

import { BrowserProvider, JsonRpcProvider } from 'ethers';

/**
 * Returns a BrowserProvider backed by MetaMask (or another injected wallet).
 * Throws if no injected provider is available.
 *
 * @returns {BrowserProvider}
 */
export function getMetaMaskProvider() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('No injected Web3 provider found. Please install MetaMask.');
  }
  return new BrowserProvider(window.ethereum);
}

/**
 * Requests wallet connection and returns the first signer.
 * Triggers the MetaMask "connect" popup.
 *
 * @returns {Promise<import('ethers').JsonRpcSigner>}
 */
export async function connectWallet() {
  // TODO: handle user rejection (user clicked "Cancel" in MetaMask)
  const provider = getMetaMaskProvider();
  await provider.send('eth_requestAccounts', []);
  return provider.getSigner();
}

/**
 * Returns the connected wallet address without requesting a new connection.
 * Returns null if no account is currently connected.
 *
 * @returns {Promise<string|null>}
 */
export async function getConnectedAccount() {
  if (!window.ethereum) return null;
  const accounts = await window.ethereum.request({ method: 'eth_accounts' });
  return accounts.length > 0 ? accounts[0] : null;
}

/**
 * Returns a read-only JsonRpcProvider for the local Hardhat node.
 * Useful for reading blockchain state without a connected wallet.
 *
 * TODO: replace hardcoded URL with VITE_ environment variable.
 *
 * @returns {JsonRpcProvider}
 */
export function getLocalProvider() {
  return new JsonRpcProvider('http://127.0.0.1:8545');
}

