/**
 * hooks/useEscrow.js  — PLACEHOLDER
 *
 * Custom React hook for fetching and mutating escrow deal data.
 *
 * Will expose:
 *   deals        : EscrowDeal[]
 *   loading      : boolean
 *   error        : string | null
 *   createDeal() : (params) => Promise<void>
 *   refresh()    : () => void
 *
 * TODO: implement using services/escrowService.js.
 */

import { useState, useCallback } from 'react';

export function useEscrow() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    // TODO: call escrowService.getDealsByAddress(account)
    console.warn('useEscrow.refresh: not yet implemented');
  }, []);

  const createDeal = useCallback(async (params) => {
    // TODO: call escrowService.createDeal(params), then refresh()
    console.warn('useEscrow.createDeal: not yet implemented');
  }, []);

  return { deals, loading, error, createDeal, refresh };
}

