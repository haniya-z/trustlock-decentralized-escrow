/**
 * context/WalletContext.jsx  — PLACEHOLDER
 *
 * React Context that provides wallet state app-wide.
 * Wrap <App /> (or the router) with <WalletProvider>.
 *
 * TODO: implement using the useWallet hook.
 * TODO: persist connection across page reloads (check eth_accounts on mount).
 */

import React, { createContext, useContext } from 'react';
import { useWallet } from '../hooks/useWallet.js';

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const wallet = useWallet();
  return (
    <WalletContext.Provider value={wallet}>
      {children}
    </WalletContext.Provider>
  );
}

/**
 * Convenience hook for consuming WalletContext.
 * @returns {{ account: string|null, connect: Function, disconnect: Function }}
 */
export function useWalletContext() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWalletContext must be used inside <WalletProvider>');
  return ctx;
}

