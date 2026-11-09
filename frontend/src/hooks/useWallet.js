/**
 * hooks/useWallet.js  — PLACEHOLDER
 *
 * Custom React hook for managing wallet connection state.
 *
 * Will expose:
 *   account     : string | null   — connected wallet address
 *   chainId     : number | null   — current chain
 *   isConnecting: boolean
 *   connect()   : () => Promise<void>
 *   disconnect(): () => void
 *
 * TODO: implement using blockchain.js helpers.
 * TODO: listen to window.ethereum accountsChanged / chainChanged events.
 */

import { useState, useCallback } from 'react';

export function useWallet() {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async () => {
    // TODO: call connectWallet() from services/blockchain.js
    console.warn('useWallet.connect: not yet implemented');
  }, []);

  const disconnect = useCallback(() => {
    // TODO: clear state, remove event listeners
    setAccount(null);
    setChainId(null);
  }, []);

  return { account, chainId, isConnecting, connect, disconnect };
}

