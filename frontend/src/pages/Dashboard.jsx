/**
 * pages/Dashboard.jsx
 * User dashboard — lists all escrow deals for the connected wallet.
 *
 * TODO: fetch deals from the Escrow contract via escrowService.
 * TODO: add filtering by state (active, completed, disputed, etc.).
 * TODO: implement pagination or infinite scroll.
 * TODO: show wallet connection prompt when no wallet is detected.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function Dashboard() {
  // TODO: replace with real data fetched from the blockchain
  const deals = [];

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My Escrows</h1>
        <Link
          to="/create"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: '#6366f1',
            color: '#fff',
            padding: '0.6rem 1.2rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          <Plus size={18} /> New Escrow
        </Link>
      </div>

      {/* TODO: render deal cards once data is available */}
      {deals.length === 0 ? (
        <div
          style={{
            marginTop: '3rem',
            textAlign: 'center',
            color: '#888',
            border: '2px dashed #e5e7eb',
            borderRadius: '12px',
            padding: '3rem',
          }}
        >
          <p style={{ fontSize: '1.1rem' }}>No escrow deals yet.</p>
          <p>Connect your wallet and create your first deal to get started.</p>
        </div>
      ) : (
        <ul>
          {deals.map((deal) => (
            <li key={deal.id}>{/* TODO: render <DealCard deal={deal} /> */}</li>
          ))}
        </ul>
      )}
    </main>
  );
}

